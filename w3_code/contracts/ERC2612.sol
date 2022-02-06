//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC2612 is ERC20, ERC20Permit {

    constructor() ERC20("ERC2612", "ERC2612") ERC20Permit("ERC2612") {
        _mint(msg.sender, 1000 * 10 ** 18);
    }
}