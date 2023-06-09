/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../common";
import type {
  RecordingsTracker,
  RecordingsTrackerInterface,
} from "../RecordingsTracker";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "prefix",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "MessageChanged",
    type: "event",
  },
  {
    inputs: [],
    name: "getMessage",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "messages",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "prefix",
        type: "string",
      },
    ],
    name: "postUpgrade",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "setMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162000cb938038062000cb98339810160408190526200003491620001e9565b6200003f8162000046565b50620003f2565b60006200006060008051602062000c998339815191525490565b90506001600160a01b03811662000090576001600160a01b0360008051602062000c9983398151915255620000a6565b336001600160a01b03821614620000a657600080fd5b6001620000b4838262000322565b505050565b634e487b7160e01b600052604160045260246000fd5b601f19601f83011681018181106001600160401b0382111715620000f757620000f7620000b9565b6040525050565b60006200010a60405190565b9050620001188282620000cf565b919050565b60006001600160401b03821115620001395762000139620000b9565b601f19601f83011660200192915050565b60005b83811015620001675781810151838201526020016200014d565b50506000910152565b60006200018762000181846200011d565b620000fe565b905082815260208101848484011115620001a457620001a4600080fd5b620001b18482856200014a565b509392505050565b600082601f830112620001cf57620001cf600080fd5b8151620001e184826020860162000170565b949350505050565b600060208284031215620002005762000200600080fd5b81516001600160401b038111156200021b576200021b600080fd5b620001e184828501620001b9565b634e487b7160e01b600052602260045260246000fd5b6002810460018216806200025457607f821691505b60208210810362000269576200026962000229565b50919050565b6000620002806200027d8381565b90565b92915050565b62000291836200026f565b815460001960089490940293841b1916921b91909117905550565b6000620000b481848462000286565b81811015620002da57620002d1600082620002ac565b600101620002bb565b5050565b601f821115620000b4576000818152602090206020601f85010481016020851015620003075750805b6200031b6020601f860104830182620002bb565b5050505050565b81516001600160401b038111156200033e576200033e620000b9565b6200034a82546200023f565b62000357828285620002de565b6020601f8311600181146200038e5760008415620003755750858201515b600019600886021c1981166002860217865550620003ea565b600085815260208120601f198616915b82811015620003c057888501518255602094850194600190920191016200039e565b86831015620003dd5784890151600019601f89166008021c191682555b6001600288020188555050505b505050505050565b61089780620004026000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c8063368b8772146100515780635fdd59f814610066578063b1441ce61461008f578063ce6d41de146100a2575b600080fd5b61006461005f366004610395565b6100aa565b005b610079610074366004610412565b610132565b6040516100869190610491565b60405180910390f35b61006461009d36600461059f565b6101cc565b61007961025b565b6000600183836040516020016100c2939291906106a1565b60408051601f198184030181529181523360009081526020819052209091506100eb8282610762565b50336001600160a01b03167f5de788bae851e5b8df641f15cc3e7e401946111d99b835b0e3f619b04f8ce68f826040516101259190610491565b60405180910390a2505050565b6000602081905290815260409020805461014b906105f0565b80601f0160208091040260200160405190810160405280929190818152602001828054610177906105f0565b80156101c45780601f10610199576101008083540402835291602001916101c4565b820191906000526020600020905b8154815290600101906020018083116101a757829003601f168201915b505050505081565b60006101f67fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61035490565b90506001600160a01b038116610235576001600160a01b037fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61035561024a565b336001600160a01b0382161461024a57600080fd5b60016102568382610762565b505050565b3360009081526020819052604081208054606092919061027a906105f0565b80601f01602080910402602001604051908101604052809291908181526020018280546102a6906105f0565b80156102f35780601f106102c8576101008083540402835291602001916102f3565b820191906000526020600020905b8154815290600101906020018083116102d657829003601f168201915b50505050509050600081511161033e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161033590610826565b60405180910390fd5b919050565b60008083601f84011261035857610358600080fd5b50813567ffffffffffffffff81111561037357610373600080fd5b60208301915083600182028301111561038e5761038e600080fd5b9250929050565b600080602083850312156103ab576103ab600080fd5b823567ffffffffffffffff8111156103c5576103c5600080fd5b6103d185828601610343565b92509250509250929050565b60006001600160a01b0382165b92915050565b6103f9816103dd565b811461040457600080fd5b50565b80356103ea816103f0565b60006020828403121561042757610427600080fd5b60006104338484610407565b949350505050565b60005b8381101561045657818101518382015260200161043e565b50506000910152565b6000610469825190565b80845260208401935061048081856020860161043b565b601f01601f19169290920192915050565b602080825281016104a2818461045f565b9392505050565b634e487b7160e01b600052604160045260246000fd5b601f19601f830116810181811067ffffffffffffffff821117156104e5576104e56104a9565b6040525050565b60006104f760405190565b905061033e82826104bf565b600067ffffffffffffffff82111561051d5761051d6104a9565b601f19601f83011660200192915050565b82818337506000910152565b600061054d61054884610503565b6104ec565b90508281526020810184848401111561056857610568600080fd5b61057384828561052e565b509392505050565b600082601f83011261058f5761058f600080fd5b813561043384826020860161053a565b6000602082840312156105b4576105b4600080fd5b813567ffffffffffffffff8111156105ce576105ce600080fd5b6104338482850161057b565b634e487b7160e01b600052602260045260246000fd5b60028104600182168061060457607f821691505b602082108103610616576106166105da565b50919050565b60008154610629816105f0565b600182168015610640576001811461065557610685565b60ff1983168652811515820286019350610685565b60008581526020902060005b8381101561067d57815488820152600190910190602001610661565b838801955050505b50505092915050565b600061069b83858461052e565b50500190565b60006106ad828661061c565b91506106ba82848661068e565b95945050505050565b60006103ea6106cf8381565b90565b6106db836106c3565b815460001960089490940293841b1916921b91909117905550565b60006102568184846106d2565b8181101561071e576107166000826106f6565b600101610703565b5050565b601f821115610256576000818152602090206020601f850104810160208510156107495750805b61075b6020601f860104830182610703565b5050505050565b815167ffffffffffffffff81111561077c5761077c6104a9565b61078682546105f0565b610791828285610722565b6020601f8311600181146107c557600084156107ad5750858201515b600019600886021c198116600286021786555061081e565b600085815260208120601f198616915b828110156107f557888501518255602094850194600190920191016107d5565b868310156108115784890151600019601f89166008021c191682555b6001600288020188555050505b505050505050565b602080825281016103ea81600f81527f4e6f206d657373616765207365742e000000000000000000000000000000000060208201526040019056fea26469706673582212204f49e6908a1f7cf9020bb9083451ed9e7fed8f8f94fa11fdd79a753998633cee64736f6c63430008120033b53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";

type RecordingsTrackerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RecordingsTrackerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RecordingsTracker__factory extends ContractFactory {
  constructor(...args: RecordingsTrackerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    prefix: string,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(prefix, overrides || {});
  }
  override deploy(
    prefix: string,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(prefix, overrides || {}) as Promise<
      RecordingsTracker & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): RecordingsTracker__factory {
    return super.connect(runner) as RecordingsTracker__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RecordingsTrackerInterface {
    return new Interface(_abi) as RecordingsTrackerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): RecordingsTracker {
    return new Contract(address, _abi, runner) as unknown as RecordingsTracker;
  }
}
