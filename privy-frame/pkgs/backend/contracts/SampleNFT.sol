// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract SampleNFT is ERC721, ERC2771Context {
  string private _baseTokenURI;
  uint256 private _nextTokenId;

  // Adding a constructor compatible with ERC721 and ERC2771Context
  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    address trustedForwarder
  )
    ERC721(name, symbol)
    ERC2771Context(trustedForwarder) // Initialize ERC2771Context with the trusted forwarder address
  {
    _baseTokenURI = baseTokenURI;
  }

  // Override _msgSender() and _msgData() to use ERC2771Context versions
  function _msgSender()
    internal
    view
    override(Context, ERC2771Context)
    returns (address)
  {
    return ERC2771Context._msgSender();
  }

  function _msgData()
    internal
    view
    override(Context, ERC2771Context)
    returns (bytes calldata)
  {
    return ERC2771Context._msgData();
  }

  // Override _contextSuffixLength() to resolve the conflict
  function _contextSuffixLength()
    internal
    view
    override(Context, ERC2771Context)
    returns (uint256)
  {
    return ERC2771Context._contextSuffixLength();
  }

  // Basic minting function
  function mint(address to) public {
    uint256 tokenId = _nextTokenId++;
    _safeMint(to, tokenId);
  }

  // Override base URI
  function _baseURI() internal view override returns (string memory) {
    return _baseTokenURI;
  }
}
