import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForSupplier = ({ web3, contract }) => {
    const [productId, setProductId] = useState('');
    const [productDetails, setProductDetails] = useState(null);

    const locationMapping = {
        '0x95329f0f598032755f454b63034035528a2f09e00bb3dde055a4f8e3f7b11683': 'Producer',
        '0x73967856f9b5346abe71888df46a2ec7db7c1f0858d2c03db794d4ed5c489ebd': 'Shipping Company',
        '0xaac53439bd8bd079432ddf9a77f0bf60ed770eb955a5cfe446a47d91abb89482': 'Warehouse',
        '0x2fda503267614f1ecf76dbd23c97ab9adfe71937c1af62512911188523b9df4b': 'Packaging Company',
        '0x85ac2eaf30f3ccb6e96b92152eec71d26c49002f4202f076dce66db4205fa9bf': 'Distribution Company'
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'productId') {
            setProductId(value);
        }
    };

    const getProductDetailsSupplier = async() =>{
        if (contract && productId){
            try {
                // Call the contract method
                const details = await contract.methods.getProductDetailsSupplier(
                    parseInt(productId)
                ).call({ from: web3.currentProvider.selectedAddress });

                // Convert BigInt to number
                const dateOfDeparture = Number(details[3]);
                const expectedArrivalDate = Number(details[4]);

                // Parse the response
                const productDetails = {
                    productName: details[0],
                    currentLocation: locationMapping[details[1]] || details[1], // Convert bytes32 to string
                    quantity: parseInt(details[2]),
                    dateOfDeparture: new Date(dateOfDeparture * 1000).toLocaleString(), // Convert seconds to date
                    expectedArrivalDate: new Date(expectedArrivalDate * 1000).toLocaleString(), // Convert seconds to date
                };

                setProductDetails(productDetails);
                // setProductId('');
            } catch (error) {
                console.error('Error fetching product details:', error);
                toast.error('Error fetching product details', {
                    position: 'bottom-center',
                    autoClose: 3000
                });
                setProductDetails(null);
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
            <div className="getProductDetailsSupplierContainer">
                <h2>Get Product Details</h2>
                <input
                    type="text"
                    name="productId"
                    value={productId}
                    onChange={handleInputChange}
                    placeholder="Product ID"
                />
                <div className='btnArea'>
                    <button onClick={getProductDetailsSupplier}>Get Product Details</button>
                </div>
                {productDetails && (
                    <div className="productDetails">
                        <h3>Product Details:</h3>
                        <p><strong>Product Name:</strong> {productDetails.productName}</p>
                        <p><strong>Current Location:</strong> {productDetails.currentLocation}</p>
                        <p><strong>Quantity:</strong> {productDetails.quantity}</p>
                        <p><strong>Date of Departure:</strong> {productDetails.dateOfDeparture}</p>
                        <p><strong>Expected Arrival Date:</strong> {productDetails.expectedArrivalDate}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForSupplier;