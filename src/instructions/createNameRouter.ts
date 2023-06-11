/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from "@metaplex-foundation/beet";
import * as web3 from "@solana/web3.js";

/**
 * @category Instructions
 * @category CreateNameRouter
 * @category generated
 */
export type CreateNameRouterInstructionArgs = {
  signingDomain: string;
  signatureVersion: number;
};
/**
 * @category Instructions
 * @category CreateNameRouter
 * @category generated
 */
export const createNameRouterStruct = new beet.FixableBeetArgsStruct<
  CreateNameRouterInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ["instructionDiscriminator", beet.uniformFixedSizeArray(beet.u8, 8)],
    ["signingDomain", beet.utf8String],
    ["signatureVersion", beet.u8],
  ],
  "CreateNameRouterInstructionArgs"
);
/**
 * Accounts required by the _createNameRouter_ instruction
 *
 * @property [_writable_, **signer**] routerCreator
 * @property [_writable_] nameRouterAccount
 * @category Instructions
 * @category CreateNameRouter
 * @category generated
 */
export type CreateNameRouterInstructionAccounts = {
  routerCreator: web3.PublicKey;
  nameRouterAccount: web3.PublicKey;
  systemProgram?: web3.PublicKey;
  anchorRemainingAccounts?: web3.AccountMeta[];
};

export const createNameRouterInstructionDiscriminator = [
  26, 2, 251, 19, 88, 70, 117, 39,
];

/**
 * Creates a _CreateNameRouter_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category CreateNameRouter
 * @category generated
 */
export function createCreateNameRouterInstruction(
  accounts: CreateNameRouterInstructionAccounts,
  args: CreateNameRouterInstructionArgs,
  programId = new web3.PublicKey("7aDYtX4L9sRykPoo5mGAoKfDgjVMcWoo3D6B5AiUa99F")
) {
  const [data] = createNameRouterStruct.serialize({
    instructionDiscriminator: createNameRouterInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.routerCreator,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.nameRouterAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
  ];

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  });
  return ix;
}
