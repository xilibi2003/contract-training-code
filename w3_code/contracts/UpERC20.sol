// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract UpERC20 is Initializable, OwnableUpgradeable, ERC20Upgradeable {
  function initialize() public initializer {
    __Context_init_unchained();
    __Ownable_init_unchained();
    __ERC20_init_unchained("UpERC20", "UpERC20");

    _mint(msg.sender, 100000e18);
  }

}