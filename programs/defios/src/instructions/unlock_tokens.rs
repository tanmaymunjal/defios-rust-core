use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::get_associated_token_address,
    token::{transfer, Mint, Token, TokenAccount, Transfer},
};

use crate::{
    error::DefiOSError,
    state::{NameRouter, Repository, VerifiedUser, VestingSchedule},
};

#[derive(Accounts)]
#[instruction(repo_name:String)]
pub struct UnlockTokens<'info> {
    #[account(
        mut,
        address = repository_verified_user.user_pubkey @ DefiOSError::UnauthorizedUser,
    )]
    pub repository_creator: Signer<'info>,

    #[account(
        seeds = [
            repository_verified_user.user_name.as_bytes(),
            repository_creator.key().as_ref(),
            name_router_account.key().as_ref()
        ],
        bump = repository_verified_user.bump
    )]
    pub repository_verified_user: Box<Account<'info, VerifiedUser>>,

    #[account(
        address = repository_verified_user.name_router @ DefiOSError::InvalidNameRouter,
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
        mut,
        constraint = repository_creator_token_account.mint.eq(&token_mint.key()),
        address = vesting_account.destination_address,
    )]
    pub repository_creator_token_account: Account<'info, TokenAccount>,

    #[account(
        address = vesting_account.mint_address,
    )]
    pub token_mint: Account<'info, Mint>,

    #[account(
        seeds = [
            b"repository",
            repo_name.as_bytes(),
            repository_creator.key().as_ref(),
        ],
        bump=repository_account.bump
    )]
    pub repository_account: Account<'info, Repository>,

    #[account(
        mut,
        seeds = [
            b"vesting",
            token_mint.key().as_ref(),
            repository_account.key().as_ref(),
        ],
        bump = vesting_account.bump
    )]
    pub vesting_account: Account<'info, VestingSchedule>,

    #[account(
        mut,
        constraint = vesting_token_account.mint.eq(&token_mint.key()),
        constraint = vesting_token_account.owner.eq(&vesting_account.key())
    )]
    pub vesting_token_account: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<UnlockTokens>, repo_name: String) -> Result<()> {
    let vesting_account = &mut ctx.accounts.vesting_account;
    let repository_creator = &mut ctx.accounts.repository_creator;
    let repository_account = &ctx.accounts.repository_account;
    let token_program = &ctx.accounts.token_program;
    let repository_creator_token_account = &ctx.accounts.repository_creator_token_account;
    let token_mint = &ctx.accounts.token_mint;
    let vesting_token_account = &ctx.accounts.vesting_token_account;
    let rewards_mint = &ctx.accounts.token_mint;
    let current_timestamp = Clock::get()?.unix_timestamp;

    let expected_repository_creator_token_account =
        get_associated_token_address(&repository_creator.key(), &rewards_mint.key());

    require!(
        expected_repository_creator_token_account.eq(&repository_creator.key()),
        DefiOSError::CanNotMergePullRequest
    );

    let mut total_transfer_tokens = 0;
    for s in vesting_account.schedules.iter_mut() {
        if current_timestamp as u64 >= s.release_time {
            total_transfer_tokens += s.amount;
            s.amount = 0;
        }
    }

    require!(
        total_transfer_tokens > 0,
        DefiOSError::VestingNotReachedRelease
    );

    let token_mint_key = token_mint.key();
    let repository_account_key = repository_account.key();
    let signer_seeds: &[&[&[u8]]] = &[&[
        b"vesting",
        token_mint_key.as_ref(),
        repository_account_key.as_ref(),
        &[vesting_account.bump],
    ]];

    transfer(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            Transfer {
                from: vesting_token_account.to_account_info(),
                to: repository_creator_token_account.to_account_info(),
                authority: vesting_account.to_account_info(),
            },
            signer_seeds,
        ),
        total_transfer_tokens,
    )?;

    Ok(())
}
