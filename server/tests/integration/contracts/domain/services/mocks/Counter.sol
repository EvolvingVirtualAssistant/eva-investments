pragma solidity =0.8.10;

contract Counter {
    uint256 public value;

    function increase(uint256 amount) public {
        value += amount;
    }
}
