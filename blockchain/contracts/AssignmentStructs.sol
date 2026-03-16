// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

enum ShippingStatus{
    Pending,
    In_Transit,
    Delivered
}

struct Product{
    string productName;
    bytes32 currentLocation;
    uint256 quantity;
}

struct ShippingInfo{
    uint256 transferId;
    uint256 productId;
    bytes32 origin;  
    bytes32 destination;
    uint256 dateOfDeparture;
    uint256 expectedArrivalDate;
    ShippingStatus shippingStatus;
}

struct User{
    address addr;
    bytes32 role;
}

struct Entity{
    string entityName;
    address entityAddr;
    bytes32 entityType;
}