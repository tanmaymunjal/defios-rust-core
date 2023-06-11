/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from "@metaplex-foundation/beet";
import * as web3 from "@solana/web3.js";
import * as beetSolana from "@metaplex-foundation/beet-solana";

/**
 * Arguments used to create {@link PRStaker}
 * @category Accounts
 * @category generated
 */
export type PRStakerArgs = {
  bump: number;
  stakedAmount: beet.bignum;
  stakedAt: beet.bignum[];
  prStaker: web3.PublicKey;
  pr: web3.PublicKey;
  prStakerTokenAccount: web3.PublicKey;
};

export const pRStakerDiscriminator = [125, 109, 247, 116, 16, 251, 69, 187];
/**
 * Holds the data for the {@link PRStaker} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class PRStaker implements PRStakerArgs {
  private constructor(
    readonly bump: number,
    readonly stakedAmount: beet.bignum,
    readonly stakedAt: beet.bignum[],
    readonly prStaker: web3.PublicKey,
    readonly pr: web3.PublicKey,
    readonly prStakerTokenAccount: web3.PublicKey
  ) {}

  /**
   * Creates a {@link PRStaker} instance from the provided args.
   */
  static fromArgs(args: PRStakerArgs) {
    return new PRStaker(
      args.bump,
      args.stakedAmount,
      args.stakedAt,
      args.prStaker,
      args.pr,
      args.prStakerTokenAccount
    );
  }

  /**
   * Deserializes the {@link PRStaker} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [PRStaker, number] {
    return PRStaker.deserialize(accountInfo.data, offset);
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link PRStaker} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<PRStaker> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find PRStaker account at ${address}`);
    }
    return PRStaker.fromAccountInfo(accountInfo, 0)[0];
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey(
      "7aDYtX4L9sRykPoo5mGAoKfDgjVMcWoo3D6B5AiUa99F"
    )
  ) {
    return beetSolana.GpaBuilder.fromStruct(programId, pRStakerBeet);
  }

  /**
   * Deserializes the {@link PRStaker} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [PRStaker, number] {
    return pRStakerBeet.deserialize(buf, offset);
  }

  /**
   * Serializes the {@link PRStaker} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return pRStakerBeet.serialize({
      accountDiscriminator: pRStakerDiscriminator,
      ...this,
    });
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link PRStaker} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args: PRStakerArgs) {
    const instance = PRStaker.fromArgs(args);
    return pRStakerBeet.toFixedFromValue({
      accountDiscriminator: pRStakerDiscriminator,
      ...instance,
    }).byteSize;
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link PRStaker} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    args: PRStakerArgs,
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      PRStaker.byteSize(args),
      commitment
    );
  }

  /**
   * Returns a readable version of {@link PRStaker} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      bump: this.bump,
      stakedAmount: (() => {
        const x = <{ toNumber: () => number }>this.stakedAmount;
        if (typeof x.toNumber === "function") {
          try {
            return x.toNumber();
          } catch (_) {
            return x;
          }
        }
        return x;
      })(),
      stakedAt: this.stakedAt,
      prStaker: this.prStaker.toBase58(),
      pr: this.pr.toBase58(),
      prStakerTokenAccount: this.prStakerTokenAccount.toBase58(),
    };
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const pRStakerBeet = new beet.FixableBeetStruct<
  PRStaker,
  PRStakerArgs & {
    accountDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ["accountDiscriminator", beet.uniformFixedSizeArray(beet.u8, 8)],
    ["bump", beet.u8],
    ["stakedAmount", beet.u64],
    ["stakedAt", beet.array(beet.u64)],
    ["prStaker", beetSolana.publicKey],
    ["pr", beetSolana.publicKey],
    ["prStakerTokenAccount", beetSolana.publicKey],
  ],
  PRStaker.fromArgs,
  "PRStaker"
);
