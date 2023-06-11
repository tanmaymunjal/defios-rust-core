/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from "@metaplex-foundation/beet";
import * as web3 from "@solana/web3.js";
import * as beetSolana from "@metaplex-foundation/beet-solana";
import { RoadmapOutlook, roadmapOutlookBeet } from "../types/RoadmapOutlook";

/**
 * Arguments used to create {@link RoadMapMetaDataStore}
 * @category Accounts
 * @category generated
 */
export type RoadMapMetaDataStoreArgs = {
  bump: number;
  roadmapTitle: string;
  roadmapCreationUnix: beet.bignum;
  roadmapCreatorId: web3.PublicKey;
  roadmapDescriptionLink: string;
  rootObjectiveIds: web3.PublicKey[];
  roadmapCreator: web3.PublicKey;
  roadmapOutlook: RoadmapOutlook;
  roadmapImageUrl: string;
  roadmapRepository: web3.PublicKey;
};

export const roadMapMetaDataStoreDiscriminator = [
  12, 201, 20, 202, 152, 147, 166, 76,
];
/**
 * Holds the data for the {@link RoadMapMetaDataStore} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class RoadMapMetaDataStore implements RoadMapMetaDataStoreArgs {
  private constructor(
    readonly bump: number,
    readonly roadmapTitle: string,
    readonly roadmapCreationUnix: beet.bignum,
    readonly roadmapCreatorId: web3.PublicKey,
    readonly roadmapDescriptionLink: string,
    readonly rootObjectiveIds: web3.PublicKey[],
    readonly roadmapCreator: web3.PublicKey,
    readonly roadmapOutlook: RoadmapOutlook,
    readonly roadmapImageUrl: string,
    readonly roadmapRepository: web3.PublicKey
  ) {}

  /**
   * Creates a {@link RoadMapMetaDataStore} instance from the provided args.
   */
  static fromArgs(args: RoadMapMetaDataStoreArgs) {
    return new RoadMapMetaDataStore(
      args.bump,
      args.roadmapTitle,
      args.roadmapCreationUnix,
      args.roadmapCreatorId,
      args.roadmapDescriptionLink,
      args.rootObjectiveIds,
      args.roadmapCreator,
      args.roadmapOutlook,
      args.roadmapImageUrl,
      args.roadmapRepository
    );
  }

  /**
   * Deserializes the {@link RoadMapMetaDataStore} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [RoadMapMetaDataStore, number] {
    return RoadMapMetaDataStore.deserialize(accountInfo.data, offset);
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link RoadMapMetaDataStore} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<RoadMapMetaDataStore> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(
        `Unable to find RoadMapMetaDataStore account at ${address}`
      );
    }
    return RoadMapMetaDataStore.fromAccountInfo(accountInfo, 0)[0];
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
    return beetSolana.GpaBuilder.fromStruct(
      programId,
      roadMapMetaDataStoreBeet
    );
  }

  /**
   * Deserializes the {@link RoadMapMetaDataStore} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [RoadMapMetaDataStore, number] {
    return roadMapMetaDataStoreBeet.deserialize(buf, offset);
  }

  /**
   * Serializes the {@link RoadMapMetaDataStore} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return roadMapMetaDataStoreBeet.serialize({
      accountDiscriminator: roadMapMetaDataStoreDiscriminator,
      ...this,
    });
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link RoadMapMetaDataStore} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args: RoadMapMetaDataStoreArgs) {
    const instance = RoadMapMetaDataStore.fromArgs(args);
    return roadMapMetaDataStoreBeet.toFixedFromValue({
      accountDiscriminator: roadMapMetaDataStoreDiscriminator,
      ...instance,
    }).byteSize;
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link RoadMapMetaDataStore} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    args: RoadMapMetaDataStoreArgs,
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      RoadMapMetaDataStore.byteSize(args),
      commitment
    );
  }

  /**
   * Returns a readable version of {@link RoadMapMetaDataStore} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      bump: this.bump,
      roadmapTitle: this.roadmapTitle,
      roadmapCreationUnix: (() => {
        const x = <{ toNumber: () => number }>this.roadmapCreationUnix;
        if (typeof x.toNumber === "function") {
          try {
            return x.toNumber();
          } catch (_) {
            return x;
          }
        }
        return x;
      })(),
      roadmapCreatorId: this.roadmapCreatorId.toBase58(),
      roadmapDescriptionLink: this.roadmapDescriptionLink,
      rootObjectiveIds: this.rootObjectiveIds,
      roadmapCreator: this.roadmapCreator.toBase58(),
      roadmapOutlook: "RoadmapOutlook." + RoadmapOutlook[this.roadmapOutlook],
      roadmapImageUrl: this.roadmapImageUrl,
      roadmapRepository: this.roadmapRepository.toBase58(),
    };
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const roadMapMetaDataStoreBeet = new beet.FixableBeetStruct<
  RoadMapMetaDataStore,
  RoadMapMetaDataStoreArgs & {
    accountDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ["accountDiscriminator", beet.uniformFixedSizeArray(beet.u8, 8)],
    ["bump", beet.u8],
    ["roadmapTitle", beet.utf8String],
    ["roadmapCreationUnix", beet.i64],
    ["roadmapCreatorId", beetSolana.publicKey],
    ["roadmapDescriptionLink", beet.utf8String],
    ["rootObjectiveIds", beet.array(beetSolana.publicKey)],
    ["roadmapCreator", beetSolana.publicKey],
    ["roadmapOutlook", roadmapOutlookBeet],
    ["roadmapImageUrl", beet.utf8String],
    ["roadmapRepository", beetSolana.publicKey],
  ],
  RoadMapMetaDataStore.fromArgs,
  "RoadMapMetaDataStore"
);
