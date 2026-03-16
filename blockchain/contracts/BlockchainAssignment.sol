// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

import "./AssignmentStructs.sol";

contract BlockchainAssignment {
    uint256 private productsLength;
    uint256 private shippingInfoCount;
    uint256[] private productIndices;

    // Mappings
    mapping(uint256 => Product) private products;
    mapping(uint256 => ShippingInfo) private shippingInfo;
    mapping(address => User) private users;
    mapping(address => Entity) private entities;
    mapping(uint256 => bytes32[]) private productLocations;

    //Events
    event UserAdded(address indexed account, bytes32 role);
    event UserRemoved(address indexed account);
    event EntityAdded(
        string entityName,
        address indexed account,
        bytes32 entityType
    );
    event EntityRemoved(address indexed account);
    event ProductAdded(
        string productName,
        bytes32 currentLocation,
        uint256 quality
    );
    event ProductUpdated(
        uint256 productId,
        string productName,
        bytes32 currentLocation,
        uint256 quantity
    );
    event CurrLocUpdated(uint256 productId, bytes32 currentLocation);
    event ProductRemoved(uint _index);
    event ShipmentAdded(
        uint256 transferId,
        uint256 productId,
        bytes32 origin,
        bytes32 destination,
        uint256 dateOfDeparture,
        uint256 expectedArrivalDate,
        ShippingStatus shippingStatus
    );
    event ShipmentUpdated(
        uint256 transferId,
        uint256 productId,
        bytes32 origin,
        bytes32 destination,
        uint256 dateOfDeparture,
        uint256 expectedArrivalDate,
        ShippingStatus shippingStatus
    );

    // Define entity types
    // 0x95329f0f598032755f454b63034035528a2f09e00bb3dde055a4f8e3f7b11683
    bytes32 private constant PRODUCER = keccak256(abi.encodePacked("Producer"));
    //  0x73967856f9b5346abe71888df46a2ec7db7c1f0858d2c03db794d4ed5c489ebd
    bytes32 private constant SHIPPING_COMPANY =
        keccak256(abi.encodePacked("Shipping Company"));
    // 0xaac53439bd8bd079432ddf9a77f0bf60ed770eb955a5cfe446a47d91abb89482
    bytes32 private constant WAREHOUSE =
        keccak256(abi.encodePacked("Warehouse"));
    //  0x2fda503267614f1ecf76dbd23c97ab9adfe71937c1af62512911188523b9df4b
    bytes32 private constant PACKAGING_COMPANY =
        keccak256(abi.encodePacked("Packaging Company"));
    // 0x85ac2eaf30f3ccb6e96b92152eec71d26c49002f4202f076dce66db4205fa9bf
    bytes32 private constant DISTRIBUTION_COMPANY =
        keccak256(abi.encodePacked("Distribution Company"));

    // Define roles
    // 0xb2c1aaaf9f516585466c9876e2eaf06ee68751aad537b2a6fa22f473d03b58eb
    bytes32 private constant ROLE_ADMIN =
        keccak256(abi.encodePacked("Administrator"));
    // 0xb77c7d6bf62fa24fc205955093030c58325cd2d3d35fb486ede7594fb99635f5
    bytes32 private constant ROLE_SUPPLIER =
        keccak256(abi.encodePacked("Supplier"));
    //  0xa19d0db335544d3c3ec35c34b9b35a51bd4861f7162de07d5af409611794db04
    bytes32 private constant ROLE_DISTRIBUTOR =
        keccak256(abi.encodePacked("Distributor"));
    //  0x45eccfe3ded836ac48522625d95e9587e4f194da947361bb0a0268fcbc01418a
    bytes32 private constant ROLE_AUDITOR =
        keccak256(abi.encodePacked("Auditor"));

    // Modifiers
    modifier checkRole(bytes32 _role) {
        require(users[msg.sender].role == _role, "Not Authorized!");
        _;
    }

    modifier validRoles() {
        require(
            users[msg.sender].role == ROLE_ADMIN ||
                users[msg.sender].role == ROLE_SUPPLIER ||
                users[msg.sender].role == ROLE_DISTRIBUTOR ||
                users[msg.sender].role == ROLE_AUDITOR,
            "Not Authorized!"
        );
        _;
    }

    modifier supplierAccess(uint256 _productId) {
        require(_productId < productsLength, "Invalid product ID");
        require(
            users[msg.sender].role == ROLE_SUPPLIER &&
                (products[_productId].currentLocation == PRODUCER ||
                    products[_productId].currentLocation == SHIPPING_COMPANY ||
                    products[_productId].currentLocation == WAREHOUSE ||
                    products[_productId].currentLocation == PACKAGING_COMPANY),
            "Not Authorized!"
        );
        _;
    }

    modifier fullAccess(uint256 _productId) {
        require(_productId < productsLength, "Invalid product ID");
        require(
            (users[msg.sender].role == ROLE_DISTRIBUTOR &&
                (products[_productId].currentLocation == PRODUCER ||
                    products[_productId].currentLocation == SHIPPING_COMPANY ||
                    products[_productId].currentLocation == WAREHOUSE ||
                    products[_productId].currentLocation == PACKAGING_COMPANY ||
                    products[_productId].currentLocation ==
                    DISTRIBUTION_COMPANY)) ||
                users[msg.sender].role == ROLE_AUDITOR,
            "Not Authorized!"
        );
        _;
    }

    constructor() {
        productsLength = 0;
        shippingInfoCount = 0;

        // Initialize products
        _addProduct("Frozen Beef", PRODUCER, 100);
        _addProduct("Frozen Chicken", PRODUCER, 200);
        _addProduct("Frozen Peas", SHIPPING_COMPANY, 150);
        _addProduct("Frozen Corn", SHIPPING_COMPANY, 120);
        _addProduct("Frozen Spinach", SHIPPING_COMPANY, 130);
        _addProduct("Frozen Carrots", WAREHOUSE, 140);
        _addProduct("Frozen Broccoli", WAREHOUSE, 110);
        _addProduct("Frozen Shrimp", PACKAGING_COMPANY, 90);
        _addProduct("Frozen Fish", PACKAGING_COMPANY, 80);
        _addProduct("Frozen Strawberries", DISTRIBUTION_COMPANY, 70);
        // Initialize Shipments for the 10 products
        _addShipment(
            0,
            PRODUCER,
            SHIPPING_COMPANY,
            block.timestamp,
            block.timestamp + 1 days,
            ShippingStatus.Pending
        );
        _addShipment(
            1,
            PRODUCER,
            SHIPPING_COMPANY,
            block.timestamp,
            block.timestamp + 1 days,
            ShippingStatus.Pending
        );
        _addShipment(
            2,
            PRODUCER,
            SHIPPING_COMPANY,
            block.timestamp,
            block.timestamp + 2 days,
            ShippingStatus.Pending
        );
        _addShipment(
            3,
            PRODUCER,
            WAREHOUSE,
            block.timestamp,
            block.timestamp + 2 days,
            ShippingStatus.Pending
        );
        _addShipment(
            4,
            PRODUCER,
            WAREHOUSE,
            block.timestamp,
            block.timestamp + 3 days,
            ShippingStatus.Pending
        );
        _addShipment(
            5,
            PRODUCER,
            PACKAGING_COMPANY,
            block.timestamp,
            block.timestamp + 3 days,
            ShippingStatus.Pending
        );
        _addShipment(
            6,
            PRODUCER,
            PACKAGING_COMPANY,
            block.timestamp,
            block.timestamp + 4 days,
            ShippingStatus.Pending
        );
        _addShipment(
            7,
            PRODUCER,
            PACKAGING_COMPANY,
            block.timestamp,
            block.timestamp + 4 days,
            ShippingStatus.Pending
        );
        _addShipment(
            8,
            PRODUCER,
            DISTRIBUTION_COMPANY,
            block.timestamp,
            block.timestamp + 5 days,
            ShippingStatus.Pending
        );
        _addShipment(
            9,
            PRODUCER,
            DISTRIBUTION_COMPANY,
            block.timestamp,
            block.timestamp + 5 days,
            ShippingStatus.Pending
        );

        _addUser(msg.sender, ROLE_ADMIN);
    }

    // Functions
    // Internal function to add user with the role admin to the account that deploys the contract
    function _addUser(address _account, bytes32 _role) internal {
        users[_account] = User(_account, _role);
        emit UserAdded(_account, _role);
    }

    // External function to add a user (admin)
    function addUser(
        address _account,
        bytes32 _role
    ) external checkRole(ROLE_ADMIN) {
        _addUser(_account, _role);
    }

    // External function to get role of a user (needed for frontend)
    function getUserRole(address _user) external view returns (bytes32) {
        return users[_user].role;
    }

    // External function to remove a user (admin)
    function removeUser(address _account) external checkRole(ROLE_ADMIN) {
        delete users[_account];
        emit UserRemoved(_account);
    }

    // External function to add an entity (admin)
    function addEntity(
        string memory entityName,
        address _account,
        bytes32 _entityType
    ) external checkRole(ROLE_ADMIN) {
        entities[_account] = Entity(entityName, _account, _entityType);
        emit EntityAdded(entityName, _account, _entityType);
    }

    // External function to remove an entity (admin)
    function removeEntity(address _account) external checkRole(ROLE_ADMIN) {
        delete entities[_account];
        emit EntityRemoved(_account);
    }

    // Internal function to add a product (all users)
    function _addProduct(
        string memory productName,
        bytes32 _currLocation,
        uint256 quantity
    ) internal {
        products[productsLength] = Product(
            productName,
            _currLocation,
            quantity
        );
        productLocations[productsLength].push(_currLocation); // Track initial product location
        productIndices.push(productsLength);
        emit ProductAdded(productName, _currLocation, quantity);
        productsLength++;
    }

    // External function to add a product (all users)
    function addProduct(
        string memory productName,
        bytes32 _currLocation,
        uint256 quantity
    ) external validRoles {
        _addProduct(productName, _currLocation, quantity);
    }

    // External function to update a product (admin)
    function updateProduct(
        uint256 productId,
        string memory productName,
        bytes32 _currLocation,
        uint256 quantity
    ) external checkRole(ROLE_ADMIN) {
        require(productId < productsLength, "Product does not exist");

        Product storage product = products[productId];

        product.productName = productName;
        product.currentLocation = _currLocation;
        product.quantity = quantity;

        // Update location history for product
        productLocations[productId].push(_currLocation);

        emit ProductUpdated(productId, productName, _currLocation, quantity);
    }

    // External function to update a product's current location (all users)
    function updateCurrentLocation(
        uint256 productId,
        bytes32 _currLocation
    ) external validRoles {
        require(productId < productsLength, "Product does not exist");

        Product storage product = products[productId];
        product.currentLocation = _currLocation;

        // Update product location history
        productLocations[productId].push(_currLocation);

        emit CurrLocUpdated(productId, _currLocation);
    }

    // External function to remove a product (all users)
    function removeProduct(uint256 productId) external validRoles {
        require(productId < productsLength, "Out of bounds");

        // Find the index of the productId in the productIndices array
        uint index = 0;
        for (uint i = 0; i < productIndices.length; i++) {
            if (productIndices[i] == productId) {
                index = i;
                break;
            }
        }

        // Move the last element to the index of the product to be removed
        if (index < productIndices.length - 1) {
            productIndices[index] = productIndices[productIndices.length - 1];
        }

        // Remove the last element
        productIndices.pop();

        // Delete the product from the mapping
        delete products[productId];

        emit ProductRemoved(productId);
    }

    // Internal function to add a shipment (all users)
    function _addShipment(
        uint256 productId,
        bytes32 origin,
        bytes32 destination,
        uint256 dateOfDeparture,
        uint256 expectedArrivalDate,
        ShippingStatus shippingStatus
    ) internal {
        // Check if the product exists
        require(productId < productsLength, "Product does not exist");

        // Check if a shipment already exists for the given product ID
        for (uint256 i = 0; i < shippingInfoCount; i++) {
            if (shippingInfo[i].productId == productId) {
                revert("A shipment already exists for this product");
            }
        }

        shippingInfo[shippingInfoCount] = ShippingInfo({
            transferId: shippingInfoCount,
            productId: productId,
            origin: origin,
            destination: destination,
            dateOfDeparture: dateOfDeparture,
            expectedArrivalDate: expectedArrivalDate,
            shippingStatus: shippingStatus
        });
        emit ShipmentAdded(
            shippingInfoCount,
            productId,
            origin,
            destination,
            dateOfDeparture,
            expectedArrivalDate,
            shippingStatus
        );
        shippingInfoCount++;
    }

    // External function to add a shipment (all users)
    function addShipment(
        uint256 productId,
        bytes32 origin,
        bytes32 destination,
        uint256 dateOfDeparture,
        uint256 expectedArrivalDate,
        ShippingStatus shippingStatus
    ) external validRoles {
        _addShipment(
            productId,
            origin,
            destination,
            dateOfDeparture,
            expectedArrivalDate,
            shippingStatus
        );
    }

    // External function to update a shipment (admin)
    function updateShipment(
        uint256 transferId,
        bytes32 origin,
        bytes32 destination,
        uint256 dateOfDeparture,
        uint256 expectedArrivalDate,
        ShippingStatus shippingStatus
    ) external checkRole(ROLE_ADMIN) {
        require(transferId < shippingInfoCount, "Shipment does not exist");
        ShippingInfo storage shipment = shippingInfo[transferId];

        shipment.origin = origin;
        shipment.destination = destination;
        shipment.dateOfDeparture = dateOfDeparture;
        shipment.expectedArrivalDate = expectedArrivalDate;
        shipment.shippingStatus = shippingStatus;

        emit ShipmentUpdated(
            transferId,
            shipment.productId,
            origin,
            destination,
            dateOfDeparture,
            expectedArrivalDate,
            shippingStatus
        );
    }

    // Internal function to fetch the shipment associated with a product
    function getShipmentForProduct(
        uint256 productId
    ) internal view returns (ShippingInfo memory) {
        for (uint256 i = 0; i < shippingInfoCount; i++) {
            if (shippingInfo[i].productId == productId) {
                return shippingInfo[i];
            }
        }
        revert("No shipment found for the specified product");
    }

    // Function for supplier to get information about the product
    function getProductDetailsSupplier(
        uint256 productId
    )
        external
        view
        supplierAccess(productId)
        returns (
            string memory productName,
            bytes32 currentLocation,
            uint256 quantity,
            uint256 dateOfDeparture,
            uint256 expectedArrivalDate
        )
    {
        require(productId < productsLength, "Product does not exist");

        Product storage product = products[productId];
        ShippingInfo memory shipment = getShipmentForProduct(productId);

        return (
            product.productName,
            product.currentLocation,
            product.quantity,
            shipment.dateOfDeparture,
            shipment.expectedArrivalDate
        );
    }

    // Function for distributor/auditor to get all the informations about the product
    function getProductDetails(
        uint256 productId
    )
        external
        view
        fullAccess(productId)
        returns (
            uint256 _productId,
            string memory productName,
            bytes32 currentLocation,
            uint256 quantity,
            bytes32 origin,
            bytes32 destination,
            uint256 dateOfDeparture,
            uint256 expectedArrivalDate,
            ShippingStatus shippingStatus
        )
    {
        require(productId < productsLength, "Product does not exist");

        Product storage product = products[productId];
        ShippingInfo memory shipment = getShipmentForProduct(productId);

        return (
            shipment.productId,
            product.productName,
            product.currentLocation,
            product.quantity,
            shipment.origin,
            shipment.destination,
            shipment.dateOfDeparture,
            shipment.expectedArrivalDate,
            shipment.shippingStatus
        );
    }
}
