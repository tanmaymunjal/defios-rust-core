use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::{
        create as create_associated_token_account, get_associated_token_address, AssociatedToken,
        Create,
    },
    token::{transfer, Mint, Token, TokenAccount, Transfer},
};

use crate::error::DefiOSError;
use crate::state::{Issue, NameRouter, PRStaker, PullRequest, PullRequestStaked, VerifiedUser};
#[derive(Accounts)]
#[instruction(transfer_amount:u64)]
pub struct StakePR<'info> {
    ///CHECK: Check done using other constraints
    #[account(mut)]
    pub pull_request_addr: AccountInfo<'info>,
    #[account(mut)]
    pub issue: Account<'info, Issue>,
    #[account(
        seeds = [
            b"pullrequestadded",
            issue.key().as_ref(),
            pull_request_addr.key().as_ref()
        ],
        bump
    )]
    pub pull_request_metadata_account: Account<'info, PullRequest>,
    #[account(
        seeds = [
            pull_request_verified_user.user_name.as_bytes(),
            pull_request_addr.key().as_ref(),
            name_router_account.key().as_ref()
        ],
        bump = pull_request_verified_user.bump
    )]
    pub pull_request_verified_user: Box<Account<'info, VerifiedUser>>,
    #[account(
        mut,
        address = pull_request_metadata_account.pull_request_token_account
    )]
    pub pull_request_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pull_request_staker: Signer<'info>,
    #[account(
        mut,
        constraint = pull_request_staker_token_account.mint.eq(&pull_request_token_account.mint),
        constraint = pull_request_staker_token_account.owner.eq(&pull_request_staker.key()),
        constraint = pull_request_staker_token_account.amount >= transfer_amount @ DefiOSError::InsufficientStakingFunds
    )]
    pub pull_request_staker_token_account: Box<Account<'info, TokenAccount>>,
    #[account(
        address = pull_request_verified_user.name_router @ DefiOSError::InvalidNameRouter,
        seeds = [
            name_router_account.signing_domain.as_bytes(),
            name_router_account.signature_version.to_string().as_bytes(),
            router_creator.key().as_ref()
        ],
        bump = name_router_account.bump
    )]
    pub name_router_account: Box<Account<'info, NameRouter>>,
    #[account(
        address = name_router_account.router_creator
    )]
    pub router_creator: SystemAccount<'info>,
    #[account(
        init,
        payer = pull_request_staker,
        space = PRStaker::size(),
        seeds = [b"pullrestaker", pull_request_metadata_account.key().as_ref(), pull_request_staker.key().as_ref()],
        bump
    )]
    pub pull_request_staker_account: Box<Account<'info, PRStaker>>,
    #[account(mut)]
    pub rewards_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<StakePR>, transfer_amount: u64) -> Result<()> {
    let pull_request_staker = &ctx.accounts.pull_request_staker;
    let pull_request_metadata_account = &ctx.accounts.pull_request_metadata_account;
    let pull_request_staker_account = &mut ctx.accounts.pull_request_staker_account;
    let pull_request_staker_token_account = &ctx.accounts.pull_request_staker_token_account;
    let pull_request_token_account = &ctx.accounts.pull_request_token_account;
    let rewards_mint = &ctx.accounts.rewards_mint;
    let staked_at = Clock::get()?.unix_timestamp;
    let issue = &ctx.accounts.issue;

    require!(issue.closed_at.is_none(), DefiOSError::IssueClosedAlready);

    msg!(
        "Staking {} including decimals of token {}",
        transfer_amount,
        rewards_mint.key().to_string()
    );

    let expected_staker_token_account =
        get_associated_token_address(&pull_request_staker.key(), &rewards_mint.key());
    require!(
        expected_staker_token_account.eq(&pull_request_staker_token_account.key()),
        DefiOSError::TokenAccountMismatch
    );

    transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: pull_request_staker_token_account.to_account_info(),
                to: pull_request_token_account.to_account_info(),
                authority: pull_request_staker.to_account_info(),
            },
        ),
        transfer_amount,
    )?;

    pull_request_staker_account.bump = *ctx.bumps.get("pull_request_staker_account").unwrap();
    pull_request_staker_account.staked_amount = transfer_amount;
    pull_request_staker_account.staked_at = staked_at as u64;
    pull_request_staker_account.pr_staker = pull_request_staker.key();
    pull_request_staker_account.pr = pull_request_metadata_account.key();
    pull_request_staker_account.pr_staker_token_account = pull_request_staker_token_account.key();

    emit!(PullRequestStaked {
        pr_staker: pull_request_staker.key(),
        pr_staker_token_account: pull_request_staker_token_account.key(),
        pr_account: pull_request_metadata_account.key(),
        staked_amount: transfer_amount,
        rewards_mint: rewards_mint.key(),
        pr_contribution_link: pull_request_metadata_account.metadata_uri.clone()
    });

    Ok(())
}
