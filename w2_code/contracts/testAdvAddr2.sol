pragma solidity ^0.8.0;

contract Called {
    uint public n;
    address public sender;

    function setN(uint _n) public {
        n = _n;
        sender = msg.sender;
    }

    event logdata(uint x);

    receive() external payable {
        emit logdata(msg.value);
    }

    fallback() external {
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

contract CallTest {
    uint public n;
    address public sender;

    // 只是调用代码，合约环境还是当前合约。
    function delegatecallSetN(address _e, uint _n) public {
        bytes memory methodData =abi.encodeWithSignature("setN(uint256)", _n);
        _e.delegatecall(methodData);
    }

  function callSetN(address _e, uint _n) public {
        bytes memory methodData =abi.encodeWithSignature("setN(uint256)", _n);
        // _e.call(methodData);
        _e.call{gas:1000}(methodData);
        // _e.call{gas:1000, value: 1 ether}(methodData);
  }

}