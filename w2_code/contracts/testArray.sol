pragma solidity ^0.8.0;

contract testArray {
    uint[10] tens;
    uint[] public numbers;

	function test() public pure {
        string[4] memory adaArr = ["This", "is", "an", "array"];
        uint[] memory c = new uint[](7);
	}

    function add(uint x) public {
        numbers.push(x);
	}
}
