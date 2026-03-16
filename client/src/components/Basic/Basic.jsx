import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Basic = ({ web3, contract }) => {
    const [productName, setProductName] = useState('');
    const [currentLocation, setCurrentLocation] = useState('');
    const [quantity, setQuantity] = useState('');
    const [productId, setProductId] = useState('');
    const [newLocation, setNewLocation] = useState('');
    const [productIdDel, setProductIdDel] = useState('');
    const [prodId, setProdId] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [dateOfDeparture, setDateOfDeparture] = useState('');
    const [expectedArrivalDate, setExpectedArrivalDate] = useState('');
    const [shippingStatus, setShippingStatus] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'productName'){
            setProductName(value);
        } else if (name === 'quantity'){
            setQuantity(value);
        } else if (name === 'currentLocation'){
            setCurrentLocation(value);
        } else if (name === 'productId'){
            setProductId(value);
        } else if (name === 'newLocation'){
            setNewLocation(value);
        } else if (name === 'productIdDel'){
            setProductIdDel(value);
        } else if (name === 'prodId'){
            setProdId(value);
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

    const addProduct = async () =>{
        if (contract && productName && currentLocation && quantity) {
            try {
                // Convert currentLocation to bytes32 using Solidity keccak256
                const _currLocation = web3.utils.soliditySha3(currentLocation);

                await contract.methods.addProduct(productName, _currLocation, parseInt(quantity)).send({ from: web3.currentProvider.selectedAddress });
                
                toast.success('Product added successfully', {
                    position: 'bottom-center',
                    autoClose: 3000
                });

                // Clear input fields after successful addition
                setProductName('');
                setCurrentLocation('');
                setQuantity('');
            } catch (error) {
                console.error('Error adding product:', error);
                toast.error('Error adding product', {
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

    const updateLocation = async () =>{
        if (contract && productId && newLocation) {
          try {
            // Convert newLocation to bytes32 using Solidity keccak256
            const _newLocation = web3.utils.soliditySha3(newLocation);

            await contract.methods.updateCurrentLocation(parseInt(productId), _newLocation).send({ from: web3.currentProvider.selectedAddress });

            toast.success('Location updated successfully', {
                position: 'bottom-center',
                autoClose: 3000
            });

            // Clear input fields after successful update
            setProductId('');
            setNewLocation('');
          } catch (error) {
            console.error('Error updating location:', error);
            toast.error('Error updating location', {
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

    const removeProduct = async() =>{
        if (contract && productIdDel){
            try {
                await contract.methods.removeProduct(parseInt(productIdDel)).send({ from: web3.currentProvider.selectedAddress });
            
                toast.success('Product removed successfully', {
                    position: 'bottom-center',
                    autoClose: 3000
                });

                // Clear input fields after successful removal
                setProductIdDel('');
            } catch (error) {
                console.error('Error removing product:', error);
                toast.error('Error removing product', {
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
    }

    const addShipment = async() =>{
        if (contract && prodId && origin && destination && dateOfDeparture && expectedArrivalDate && shippingStatus){
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
                    parseInt(prodId),
                    _origin,
                    _destination,
                    _dateOfDeparture,
                    _expectedArrivalDate,
                    _shippingStatus
                ).send({ from: web3.currentProvider.selectedAddress });
                
                toast.success('Shipment added successfully', {
                    position: 'bottom-center',
                    autoClose: 3000
                });

                // Clear input fields after successful addition
                setProdId('');
                setOrigin('');
                setDestination('');
                setDateOfDeparture('');
                setExpectedArrivalDate('');
                setShippingStatus('');
            } catch (error) {
                console.error('Error adding shipment:', error);
                toast.error('Error adding shipment', {
                    position: 'bottom-center',
                    autoClose: 3000
                });
            }
        } else {
            console.log('Please fill in all fields');
            toast.error('Please fill in all fields', {
                position: 'bottom-center',
                autoClose: 3000
            });
        }
    }

    return (
        <div className="basicContainer">
            <ToastContainer />
            <div className="addProdContainer">
                <div className='header'>
                    <h2>Add Product</h2>
                </div>
                <div className="fields">
                    <input
                        type="text"
                        name="productName"
                        value={productName}
                        onChange={handleInputChange}
                        placeholder="Product Name"
                    />
                    <select name="currentLocation" value={currentLocation} onChange={handleInputChange}>
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
                </div>
                <div className="btnArea">
                    <button onClick={addProduct}>Add Product</button>
                </div> 
            </div>
            <div className="removeProductContainer">
                <div className='header'>
                    <h2>Remove Product</h2>
                </div>
                    <div className="fields">
                    <input
                        type="text"
                        name="productIdDel"
                        value={productIdDel}
                        onChange={handleInputChange}
                        placeholder="Product ID"
                    />
                </div>
                <div className="btnArea">
                    <button onClick={removeProduct}>Remove Product</button>
                </div>
            </div>
            <div className="updateLocationContainer">
                <div className='header'>
                    <h2>Update Current Location</h2>
                </div>
                <div className="fields">
                    <input
                        type="text"
                        name="productId"
                        value={productId}
                        onChange={handleInputChange}
                        placeholder="Product ID"
                    />
                    <select name="newLocation" value={newLocation} onChange={handleInputChange}>
                        <option value="">Select New Location</option>
                        <option value="Producer">Producer</option>
                        <option value="Shipping Company">Shipping Company</option>
                        <option value="Warehouse">Warehouse</option>
                        <option value="Packaging Company">Packaging Company</option>
                        <option value="Distribution Company">Distribution Company</option>
                    </select>
                </div>
                <div className="btnArea">
                    <button onClick={updateLocation}>Update Location</button>
                </div>
            </div>
            <div className="addShipmentContainer">
                <h2>Add Shipment</h2>
                <input
                    type="text"
                    name="prodId"
                    value={prodId}
                    onChange={handleInputChange}
                    placeholder="Product ID"
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
                <div className='btnArea'>
                    <button onClick={addShipment}>Add Shipment</button>
                </div>
            </div>
        </div>
    );
};

export default Basic;