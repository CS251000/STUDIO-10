import React, { useState, useEffect } from 'react';
import Select from 'react-tailwindcss-select';
import QuantityModal from './Quantity';
import ExpenseModal from './ExpenseModal';
import { db, storage } from '../firebaseConfig';
import {  doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SwprModal from './SWPR';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import SwsrModal from './SWSR';
import { RotatingLines } from 'react-loader-spinner';

export default function UpdateItem() {
    const { id } = useParams();
    const categories = [
        { value: "print", label: "Print" },
        { value: "plain", label: "Plain" },
        { value: "denim", label: "Denim" },
        { value: "check", label: "Check" },
        { value: "lycra", label: "Lycra" },
        { value: "kurta", label: "Kurta" },
        { value: "lining", label: "Lining" },
    ];

    const sizes = [
        { value: 's', label: "S" },
        { value: 'm', label: "M" },
        { value: 'l', label: "L" },
        { value: 'xl', label: "XL" },
        { value: 'xxl', label: "XXL" },
        { value: '2024', label: "20/24" },
        { value: '2630', label: "26/30" },
        { value: '3236', label: "32/36" },
        { value: '38', label: "38" }
    ];

    const expenses = [
        { value: 'washing', label: 'Washing' },
        { value: 'kadhai', label: 'Kadhai' },
        { value: 'pasting', label: 'Pasting' },
        { value: 'button', label: 'Button' },
        { value: 'design', label: 'Design' },
        { value: 'print', label: 'Print' },
        { value: 'id', label: 'ID' },
        { value: 'double-pocket', label: 'Double Pocket' },
        { value: 'others', label: 'Others' },
    ];

    const [userId, setUserId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [product, setProduct] = useState({
        itemName: '',
        jobslip: '',
        fabricator: '',
        category: [],
        sizes: [],
        meter: '',
        status: false,
        clothQuality: '',
        clothName: '',
        clothPurchaseRate: '',
        clothSaleRate: '',
        averagePiece: '',
        mrp: '',
        fabrication: '',
        discount: '',
        packingCharge: '',
        quantities: [],
        expenses: [],
        swpr: [],
        swsr: [],
        imageUrl: '',
        createdAt: Timestamp.now(),
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, 'products', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProduct(docSnap.data());
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            }
        });
    }, []);

    useEffect(() => {
        if (userId) {
            setProduct((prevProduct) => ({
                ...prevProduct,
                user: userId
            }));
        }
    }, [userId]);

    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isSWPRModalOpen, setIsSwprModalOpen] = useState(false);
    const [isSWSRModalOpen, setIsSwsrModalOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value
        }));
    };

    const handleCategoryChange = (selectedOptions) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            category: selectedOptions ? selectedOptions.map(option => option.value) : []
        }));
    };

    const handleSizeChange = (selectedOptions) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            sizes: selectedOptions ? selectedOptions.map(option => option.value) : []
        }));
    };

    const handleCheckboxChange = () => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            status: !prevProduct.status
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const openImageInNewTab = () => {
        if (selectedFile) {
            const newTab = window.open();
            newTab.document.body.innerHTML = `<img src="${URL.createObjectURL(selectedFile)}" />`;
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
    };

    const navigate = useNavigate();

    const handleQuantitySave = (quantities) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            quantities
        }));
    };

    const handleSwprSave = (swprValues) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            swpr: swprValues
        }));
    };

    const handleSwsrSave = (swsrValues) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            swsr: swsrValues
        }));
    };

    const handleExpenseSave = (expenseValues) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            expenses: expenseValues
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (selectedFile) {
            const storageRef = ref(storage, `images/${selectedFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, selectedFile);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    console.error('Error uploading image: ', error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    try {
                        const docRef = await updateDoc(doc(db, 'products', id), {
                            ...product,
                            imageUrl: downloadURL
                        });
                        console.log('Document written with ID: ', docRef.id);
                        setTimeout(() => {
                            setIsLoading(false);
                            navigate('/');
                        }, 2000);
                    } catch (error) {
                        console.error('Error updating document: ', error);
                        setIsLoading(false);
                    }
                }
            );
        } else {
            try {
                const docRef = await updateDoc(doc(db, 'products', id), product);
                console.log('Document written with ID: ', docRef.id);
                setTimeout(() => {
                    setIsLoading(false);
                    navigate('/');
                }, 2000);
            } catch (error) {
                console.error('Error updating document: ', error);
                setIsLoading(false);
            }
        }
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <RotatingLines
                    visible={true}
                    height="96"
                    width="96"
                    color="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    ariaLabel="rotating-lines-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            </div>
        );
    }

    const totalQuantity = product.quantities.reduce((acc, qty) => acc + qty, 0);
    const totalExpenses = product.expenses.reduce((acc, expense) => acc + expense, 0);
    const ratecost = (Number(product.averagePiece) * Number(product.clothSaleRate) + Number(totalExpenses) + Number(product.fabrication)).toFixed(2);
    let np = 0;

    for (let i = 0; i < product.swsr.length; i++) {
        np += (product.swsr[i] * (1 - (0.01 * product.discount)) - product.swpr[i] - product.packingCharge);
    }
    np /= product.swsr.length.toFixed(2);

    const cp = product.clothSaleRate - product.clothPurchaseRate - 2;

    return (
        <section className="bg-white">
            <div className="max-w-2xl mx-auto py-8">
                <h2 className="text-2xl font-bold mb-6">Update Product</h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="w-full">
                            <label htmlFor="itemName" className="block mb-2 text-sm font-medium text-gray-900">Item Name</label>
                            <input
                                type="text"
                                name="itemName"
                                id="itemName"
                                value={product.itemName}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Enter item name"
                                
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="jobslip" className="block mb-2 text-sm font-medium text-gray-900">Job Slip</label>
                            <input
                                type="text"
                                name="jobslip"
                                id="jobslip"
                                value={product.jobslip}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Enter job slip"
                                
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="fabricator" className="block mb-2 text-sm font-medium text-gray-900">Fabricator</label>
                            <input
                                type="text"
                                name="fabricator"
                                id="fabricator"
                                value={product.fabricator}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Enter fabricator"
                                
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">Category</label>
                            <Select
                                value={product.category.map(cat => ({ value: cat, label: cat }))}
                                options={categories}
                                onChange={handleCategoryChange}
                                isMultiple
                                name="category"
                                id="category"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="sizes" className="block mb-2 text-sm font-medium text-gray-900">Sizes</label>
                            <Select
                                value={product.sizes.map(size => ({ value: size, label: size }))}
                                options={sizes}
                                onChange={handleSizeChange}

                                isMultiple
                                name="sizes"
                                id="sizes"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="meter" className="block mb-2 text-sm font-medium text-gray-900">Meter</label>
                            <input
                                type="text"
                                name="meter"
                                id="meter"
                                value={product.meter}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Enter meter"
                                
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900">Status</label>
                            <input
                                type="checkbox"
                                name="status"
                                id="status"
                                checked={product.status}
                                onChange={handleCheckboxChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block"
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="clothQuality" className="block mb-2 text-sm font-medium text-gray-900">Cloth Quality</label>
                            <input
                                type="text"
                                name="clothQuality"
                                id="clothQuality"
                                value={product.clothQuality}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Enter cloth quality"
                                
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="clothName" className="block mb-2 text-sm font-medium text-gray-900">Cloth Name</label>
                            <input
                                type="text"
                                name="clothName"
                                id="clothName"
                                value={product.clothName}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Enter cloth name"
                                
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="clothPurchaseRate" className="block mb-2 text-sm font-medium text-gray-900">Cloth Purchase Rate</label>
                            <input
                                type="number"
                                name="clothPurchaseRate"
                                id="clothPurchaseRate"
                                value={product.clothPurchaseRate}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Enter cloth purchase rate"
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="clothSaleRate" className="block mb-2 text-sm font-medium text-gray-900">Cloth Sale Rate</label>
                            <input
                                type="number"
                                name="clothSaleRate"
                                id="clothSaleRate"
                                value={product.clothSaleRate}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Enter cloth sale rate"
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="averagePiece" className="block mb-2 text-sm font-medium text-gray-900">Average Piece</label>
                            <input
                                type="number"
                                name="averagePiece"
                                id="averagePiece"
                                value={product.averagePiece}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Enter average piece"
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="mrp" className="block mb-2 text-sm font-medium text-gray-900">MRP</label>
                            <input
                                type="number"
                                name="mrp"
                                id="mrp"
                                value={product.mrp}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Enter MRP"
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="fabrication" className="block mb-2 text-sm font-medium text-gray-900">Fabrication</label>
                            <input
                                type="number"
                                name="fabrication"
                                id="fabrication"
                                value={product.fabrication}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Enter fabrication"
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="discount" className="block mb-2 text-sm font-medium text-gray-900">Discount</label>
                            <input
                                type="number"
                                name="discount"
                                id="discount"
                                value={product.discount}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Enter discount percentage"
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="packingCharge" className="block mb-2 text-sm font-medium text-gray-900">Packing Charge</label>
                            <input
                                type="number"
                                name="packingCharge"
                                id="packingCharge"
                                value={product.packingCharge}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Enter packing charge"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-medium mb-4">Quantities</h3>
                        <div className="flex items-center justify-between mb-2">
                            <span>Total Quantity: {totalQuantity}</span>
                            <button type="button" 
                            className="text-white bg-blue-500 hover:bg-blue-600 focus:ring focus:ring-blue-300 px-4 py-2 rounded-lg transition"
                            onClick={() => setIsQuantityModalOpen(true)}>Update Quantities</button>
                        </div>
                        <QuantityModal
                            isOpen={isQuantityModalOpen}
                            onClose={() => setIsQuantityModalOpen(false)}
                            onSave={handleQuantitySave}
                            sizes={product.sizes}
                            quantities={product.quantities}
                        />
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-medium mb-4">Expenses</h3>
                        <div className="flex items-center justify-between mb-2">
                            <span>Total Expenses: {totalExpenses}</span>
                            <button type="button" className="text-white bg-blue-500 hover:bg-blue-600 focus:ring focus:ring-blue-300 px-4 py-2 rounded-lg transition" onClick={() => setIsExpenseModalOpen(true)}>Update Expenses</button>
                        </div>
                        <ExpenseModal
                            isOpen={isExpenseModalOpen}
                            onClose={() => setIsExpenseModalOpen(false)}
                            onSave={handleExpenseSave}
                            expenses={product.expenses}
                            availableExpenses={expenses}
                        />
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-medium mb-4">SWPR</h3>
                        <button type="button" className="text-white bg-blue-500 hover:bg-blue-600 focus:ring focus:ring-blue-300 px-4 py-2 rounded-lg transition" onClick={() => setIsSwprModalOpen(true)}>Update SWPR</button>
                        <SwprModal
                            isOpen={isSWPRModalOpen}
                            onClose={() => setIsSwprModalOpen(false)}
                            onSave={handleSwprSave}
                            sizes={product.sizes}
                            swpr={product.swpr}
                        />
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-medium mb-4">SWSR</h3>
                        <button type="button" className="text-white bg-green-700 hover:bg-green-600 focus:ring focus:ring-blue-300 px-4 py-2 rounded-lg transition" onClick={() => setIsSwsrModalOpen(true)}>Update SWSR</button>
                        <SwsrModal
                            isOpen={isSWSRModalOpen}
                            onClose={() => setIsSwsrModalOpen(false)}
                            onSave={handleSwsrSave}
                            sizes={product.sizes}
                            swsr2={product.swsr}
                        />
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-medium mb-4">Product Image</h3>
                        <div className="flex items-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                            />
                            {selectedFile && (
                                <>
                                    <button type="button" className="ml-4 text-primary-600 underline" onClick={openImageInNewTab}>Preview</button>
                                    <button type="button" className="ml-2 text-red-600 underline" onClick={handleRemoveImage}>Remove</button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-medium mb-4">Calculated Costs</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="font-semibold">Rate Cost:</span> {ratecost}
                            </div>
                            <div>
                                <span className="font-semibold">Net Profit:</span> {np.toFixed(2)}
                            </div>
                            <div>
                                <span className="font-semibold">Cloth Profit:</span> {cp}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        
                        <button
                            type="submit"
                            className="w-full bg-yellow-800 text-black py-2 px-4 rounded-lg hover:bg-primary-700 transition duration-200"
                        >
                            Update Product
                        </button>
                        
                        
                    </div>
                </form>
            </div>
        </section>
    );
}
