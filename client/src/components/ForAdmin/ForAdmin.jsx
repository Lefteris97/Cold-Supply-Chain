import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForAdmin = ({ web3, contract }) => {
    const [account, setAccount] = useState('');
    const [role, setRole] = useState('');
    const [acc, setAcc] = useState('');
    const [entityName, setEntityName] = useState('');
    const [entityAccount, setEntityAccount] = useState('');
    const [entityType, setEntityType] = useState('');
    const [remEntAcc, setRemEntAcc] = useState('');
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [currLocation, setCurrLocation] = useState('');
    const [quantity, setQuantity] = useState('');
    const [transferId, setTransferId] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [dateOfDeparture, setDateOfDeparture] = useState('');
    const [expectedArrivalDate, setExpectedArrivalDate] = useState('');
    const [shippingStatus, setShippingStatus] = useState('');

    const handleInputChange = (e) =>{
        const {name, value} = e.target;

        if (name === 'account'){
            setAccount(value);
        } else if (name === 'role'){
            setRole(value);
        } else if (name === 'acc'){
            setAcc(value);
        } else if (name === 'entityName'){
            setEntityName(value);
        } else if (name === 'entityType'){
            setEntityType(value);
        } else if (name === 'entityAccount'){
            setEntityAccount(value);
        } else if (name === 'remEntAcc'){
            setRemEntAcc(value);
        } else if (name === 'productId'){
            setProductId(value);
        } else if (name === 'productName'){
            setProductName(value);
        } else if (name === 'currLocation'){
            setCurrLocation(value);
        } else if (name === 'quantity'){
            setQuantity(value);
        } else if (name === 'transferId'){
            setTransferId(value);
        } else if (name === 'origin'){
            setOrigin(value);
        } else if (name === 'destination'){
            setDestination(value);
        } else if (name === 'dateOfDeparture'){
            setDateOfDeparture(value);
        } else if (name === 'expectedArrivalDate'){ 
            setExpectedArrivalDate(value);
        } else if (name === 'shippingStatus'){
            setShippingStatus(value);
        }
    };

    const addUser = async() =>{
        if (contract && account && role){
            try {
                // Convert role to bytes32 using Solidity keccak256
                const _role = web3.utils.soliditySha3(role);

                await contract.methods.addUser(account, _role).send({ from: web3.currentProvider.selectedAddress });
                
                toast.success('User added successfully', {
                    position: 'bottom-center',
                    autoClose: 3000
                });

                // Clear input fields
                setAccount('');
                setRole('');
            } catch (error) {
                console.error('Error adding user:', error);
                toast.error('Error adding user', {
                    position: 'bottom-center',
                    autoClose: 3000
                });
            }
        } else {
            toast.error('Please fill in all fields', {
                position: 'bottom-center',
                autoClose: 3000
            });
        }
    };

    const removeUser = async() =>{
        if (contract && acc){
            try {
                await contract.methods.removeUser(acc).send({ from: web3.currentProvider.selectedAddress });
            
                toast.success('User removed successfully', {
                    position: 'bottom-center',
                    autoClose: 3000
                });

                setAcc('');
            } catch (error) {
                console.error('Error removing user:', error); 
                toast.error('Error removing user', {
                    position: 'bottom-center',
                    autoClose: 3000
                });
            }
        } else {
            toast.error('Please fill in all fields', {
                position: 'bottom-center',
                autoClose: 3000
            });
        }
    };

    const addEntity = async() =>{
        if (contract && entityName && entityAccount && entityType){
            try {
                // Convert type to bytes32 using Solidity keccak256
                const _entityType = web3.utils.soliditySha3(entityType);

                await contract.methods.addEntity(entityName, entityAccount, _entityType).send({ from: web3.currentProvider.selectedAddress });
            
                toast.success('Entity added successfully', {
                    position: 'bottom-center',
                    autoClose: 3000
                });

                setEntityName('');
                setEntityAccount('');
                setEntityType('');
            } catch (error) {
                console.error('Error adding entity:', error); 
                toast.error('Error adding entity', {
                    position: 'bottom-center',
                    autoClose: 3000
                });
            }
        } else {
            toast.error('Please fill in all fields', {
                position: 'bottom-center',
                autoClose: 3000
            });
        }
    };

    const removeEntity = async() =>{
        if (contract && remEntAcc){
            try {
                await contract.methods.removeEntity(remEntAcc).send({ from: web3.currentProvider.selectedAddress });
            
                toast.success('Entity removed successfully', {
                    position: 'bottom-center',
                    autoClose: 3000
                });

                setRemEntAcc('');
            } catch (error) {
                console.error('Error removing entity:', error); 
                toast.error('Error removing entity', {
                    position: 'bottom-center',
                    autoClose: 3000
                });
            }
        } else {
            toast.error('Please fill in all fields', {
                position: 'bottom-center',
                autoClose: 3000
            });
        }
    };

    const updateProduct = async() => {
        if (contract && productId && productName && currLocation && quantity){
            try {
                // Convert currentLocation to bytes32 using Solidity keccak256
                const _currLocation = web3.utils.soliditySha3(currLocation);

                await contract.methods.updateProduct(parseInt(productId), productName, _currLocation, parseInt(quantity)).send({ from: web3.currentProvider.selectedAddress });
            
                toast.success('Product updated successfully', {
                    position: 'bottom-center',
                    autoClose: 3000
                });

                setProductId('');
                setProductName('');
                setCurrLocation('');
                setQuantity('');
            } catch (error) {
                console.error('Error updating product:', error); 
                toast.error('Error updating product', {
                    position: 'bottom-center',
                    autoClose: 3000
                });
            }
        } else {
            toast.error('Please fill in all fields', {
                position: 'bottom-center',
                autoClose: 3000
            });
        }
    };

    const updateShipment = async() =>{
        if (contract && transferId && origin && destination && dateOfDeparture && expectedArrivalDate && shippingStatus){
            try {
                 // Convert origin and destination to bytes32 using Solidity keccak256
                 const _origin = web3.utils.soliditySha3(origin);
                 const _destination = web3.utils.soliditySha3(destination);
 
                 // Convert dates to seconds
                 const _dateOfDeparture = Math.floor(new Date(dateOfDeparture).getTime() / 1000);
                 const _expectedArrivalDate = Math.floor(new Date(expectedArrivalDate).getTime() / 1000);
                 
                 // Convert shipping status to enum index
                 const _shippingStatus = parseInt(shippingStatus);
 
                 await contract.methods.addShipment(
                     parseInt(transferId),
                     _origin,
                     _destination,
                     _dateOfDeparture,
                     _expectedArrivalDate,
                     _shippingStatus
                 ).send({ from: web3.currentProvider.selectedAddress });

                toast.success('Shipment updated successfully', {
                    position: 'bottom-center',
                    autoClose: 3000
                });

                setTransferId('');
                setOrigin('');
                setDestination('');
                setDateOfDeparture('');
                setExpectedArrivalDate('');
                setShippingStatus('');
            } catch (error) {
                console.error('Error updating shipment:', error); 
                toast.error('Error updating shipment', {
                    position: 'bottom-center',
                    autoClose: 3000
                });
            }
        } else {
            toast.error('Please fill in all fields', {
                position: 'bottom-center',
                autoClose: 3000
            });
        }
    };

    return (
        <div className='forAdminContainer'>
            <ToastContainer />
            <div className="addUserContainer">
                <div className='header'>
                    <h2>Add User</h2>
                </div>
                <div className="fields">
                    <input
                        type="text"
                        name="account"
                        value={account}
                        onChange={handleInputChange}
                        placeholder="User Address"
                    />
                    <select name="role" value={role} onChange={handleInputChange}>
                        <option value="">Select User Role</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Supplier">Supplier</option>
                        <option value="Distributor">Distributor</option>
                        <option value="Auditor">Auditor</option>
                    </select>
                </div>
                <div className='btnArea'>
                    <button onClick={addUser}>Add User</button>
                </div>
            </div>
            <div className="remUserContainer">
                <h2>Remove User</h2>
                <input 
                    type="text"
                    name="acc"
                    value={acc}
                    onChange={handleInputChange}
                    placeholder="User Address"
                />
                <div className="btnArea">
                    <button onClick={removeUser}>Remove User</button>
                </div>
            </div>
            <div className="addEntityContainer">
                <h2>Add Entity</h2>
                <input 
                    type="text"
                    name="entityName"
                    value={entityName}
                    onChange={handleInputChange}
                    placeholder="Entity Name"
                />
                <input 
                    type="text"
                    name="entityAccount"
                    value={entityAccount}
                    onChange={handleInputChange}
                    placeholder="Entity Address"
                />
                <select name="entityType" value={entityType} onChange={handleInputChange}>
                    <option value="">Select Entity Type</option>
                    <option value="Producer">Producer</option>
                    <option value="Shipping Company">Shipping Company</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Packaging Company">Packaging Company</option>
                    <option value="Distribution Company">Distribution Company</option>
                </select>
                <div className='btnArea'>
                    <button onClick={addEntity}>Add Entity</button>
                </div>
            </div>
            <div className="removeEntityContainer">
                <h2>Remove Entity</h2>
                <input
                    type="text"
                    name="remEntAcc"
                    value={remEntAcc}
                    onChange={handleInputChange}
                    placeholder="Entity Address"
                />
                <div className="btnArea">
                    <button onClick={removeEntity}>Remove Entity</button>
                </div>
            </div>
            <div className="updateProductContainer">
                <h2>Update Product</h2>
                <input
                    type="text"
                    name="productId"
                    value={productId}
                    onChange={handleInputChange}
                    placeholder="Product ID"
                />
                <input
                    type="text"
                    name="productName"
                    value={productName}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                />
                <select name="currLocation" value={currLocation} onChange={handleInputChange}>
                    <option value="">Select Current Location</option>
                    <option value="Producer">Producer</option>
                    <option value="Shipping Company">Shipping Company</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Packaging Company">Packaging Company</option>
                    <option value="Distribution Company">Distribution Company</option>
                </select>
                <input
                    type="number"
                    name="quantity"
                    value={quantity}
                    onChange={handleInputChange}
                    placeholder="Quantity"
                />
                <div className="btnArea">
                    <button onClick={updateProduct}>Update Product</button>
                </div>
            </div>
            <div className="updateShipmentContainer">
                <h2>Update Shipment</h2>
                <input
                    type="text"
                    name="transferId"
                    value={transferId}
                    onChange={handleInputChange}
                    placeholder="Transfer ID"
                />
                <select name="origin" value={origin} onChange={handleInputChange}>
                    <option value="">Select Origin</option>
                    <option value="Producer">Producer</option>
                    <option value="Shipping Company">Shipping Company</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Packaging Company">Packaging Company</option>
                    <option value="Distribution Company">Distribution Company</option>
                </select>
                <select name="destination" value={destination} onChange={handleInputChange}>
                    <option value="">Select Destination</option>
                    <option value="Producer">Producer</option>
                    <option value="Shipping Company">Shipping Company</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Packaging Company">Packaging Company</option>
                    <option value="Distribution Company">Distribution Company</option>
                </select>
                <div className="dodContainer">
                    <label htmlFor="dateOfDeparture">Date of Departure:</label>
                    <input
                        type="date"
                        name="dateOfDeparture"
                        value={dateOfDeparture}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="eadContainer">
                    <label htmlFor="expectedArrivalDate">Expected Arrival Date:</label>
                    <input
                        type="date"
                        name="expectedArrivalDate"
                        value={expectedArrivalDate}
                        onChange={handleInputChange}
                    />
                </div>
                <select name="shippingStatus" value={shippingStatus} onChange={handleInputChange}>
                    <option value="">Select Shipping Status</option>
                    <option value="0">Pending</option>
                    <option value="1">In_Transit</option>
                    <option value="2">Delivered</option>
                </select>
                <div className="btnArea">
                    <button onClick={updateShipment}>Update Shipment</button>
                </div>
            </div>
        </div>
    )
}

export default ForAdmin;