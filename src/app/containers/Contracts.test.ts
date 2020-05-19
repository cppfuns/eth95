import { act, renderHook } from "@testing-library/react-hooks";
import { useContracts } from "./Contracts";

describe("Contracts state container", () => {
  test("initial conditions", () => {
    const { result } = renderHook(() => useContracts());

    expect(result.current.contracts).toStrictEqual([]);
    expect(result.current.selectedIdx).toBe(null);
  });

  test("add and remove contract", () => {
    const { result } = renderHook(() => useContracts());

    const testContract = { abi: [], name: "MyContract" };

    expect(result.current.contracts).toStrictEqual([]);
    act(() => result.current.addContract(testContract));
    expect(result.current.contracts).toStrictEqual([testContract]);
    act(() => result.current.removeContractByIdx(0));
    expect(result.current.contracts).toStrictEqual([]);
  });

  test("sort contracts alphabetically", () => {
    const { result } = renderHook(() => useContracts());

    const testContract1 = { abi: [], name: "Alice" };
    const testContract2 = { abi: [], name: "Bob" };
    const testContract3 = { abi: [], name: "Charlie" };

    expect(result.current.contracts).toStrictEqual([]);
    act(() => result.current.addContract(testContract3));
    act(() => result.current.addContract(testContract1));
    act(() => result.current.addContract(testContract2));
    expect(result.current.contracts).toStrictEqual([
      testContract1,
      testContract2,
      testContract3,
    ]);
  });

  test("add contract by ABI", () => {
    const { result } = renderHook(() => useContracts());

    const testAbi = [{ type: "function", name: "increment" }];

    act(() => result.current.addByAbi(testAbi, "Counter.sol"));
    expect(result.current.contracts).toStrictEqual([
      {
        abi: testAbi,
        name: "Counter.sol",
      },
    ]);
  });

  test("add contract by artifact", () => {
    const { result } = renderHook(() => useContracts());

    const testArtifact = {
      contractName: "Counter",
      abi: [{ type: "function", name: "increment" }],
    };

    act(() =>
      result.current.addByArtifact(testArtifact, "Counter.sol", "./test/path"),
    );
    expect(result.current.contracts).toStrictEqual([
      {
        abi: testArtifact.abi,
        artifact: testArtifact,
        name: "Counter.sol",
        path: "./test/path",
      },
    ]);
  });

  test("update contract artifact by path", () => {
    const { result } = renderHook(() => useContracts());

    const oldArtifact = {
      contractName: "Counter",
      abi: [{ type: "function", name: "increment" }],
    };
    const newArtifact = {
      contractName: "Counter",
      abi: [{ type: "function", name: "decrement" }],
    };
    const name = "Counter.sol";
    const path = "./test/path";

    act(() => result.current.addByArtifact(oldArtifact, name, path));
    expect(result.current.contracts).toStrictEqual([
      {
        abi: oldArtifact.abi,
        artifact: oldArtifact,
        name,
        path,
      },
    ]);
    act(() => result.current.updateByPath(newArtifact, name, path));
    expect(result.current.contracts).toStrictEqual([
      {
        abi: newArtifact.abi,
        artifact: newArtifact,
        name,
        path,
      },
    ]);
  });

  test("remove contract by path", () => {
    const { result } = renderHook(() => useContracts());

    const testArtifact = {
      contractName: "Counter",
      abi: [{ type: "function", name: "increment" }],
    };
    const name = "Counter.sol";
    const path = "./test/path";

    act(() => result.current.addByArtifact(testArtifact, name, path));
    expect(result.current.contracts).toStrictEqual([
      {
        abi: testArtifact.abi,
        artifact: testArtifact,
        name,
        path,
      },
    ]);
    act(() => result.current.removeByPath(path));
    expect(result.current.contracts).toStrictEqual([]);
  });
});