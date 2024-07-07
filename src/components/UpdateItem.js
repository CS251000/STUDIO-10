import React, { useState, useEffect } from 'react';
import Select from 'react-tailwindcss-select';
import QuantityModal from './Quantity';
import ExpenseModal from './ExpenseModal';
import SwprModal from './SWPR';
import SwsrModal from './SWSR';
import { db, storage } from '../firebaseConfig';
import { collection, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { RotatingLines } from 'react-loader-spinner';

export default function UpdateItem() {
    const { id } = useParams(); // Assuming you are using React Router for routing

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
                const docSnap = await docRef.get();
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProduct(data);
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching document: ', error);
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
                        const productRef = doc(db, 'products', id);
                        await updateDoc(productRef, {
                            ...product,
                            imageUrl: downloadURL
                        });
                        console.log('Document updated');
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
                const productRef = doc(db, 'products', id);
                await updateDoc(productRef, product);
                console.log('Document updated');
                setTimeout(() => {
                    setIsLoading(false);
                    navigate('/');
                }, 2000);
            } catch (error) {
                console.error('Error updating document: ', error);
                setIsLoading(false);
            }
        }
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
                />
            </div>
        );
    }

    return (
        <section className="bg-white">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900">Update Product</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label
                            htmlFor="formFile"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Update Image
                        </label>
                        <input
                            className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:border-0 file:border-solid file:border-inherit file:bg-gray-800 file:px-3 file:py-[0.32rem] file:rounded-0 file:rounded-l-none file:text-xs file:font-semibold file:text-white file:outline-0 file:transition file:duration-300 file:ease-in-out"
                            type="file"
                            id="formFile"
                            onChange={handleImageChange}
                        />
                        {selectedFile && (
                            <div className="mt-2 flex items-center space-x-4">
                                <button
                                    type="button"
                                    className="text-sm font-medium text-red-500 hover:text-red-600 focus:outline-none"
                                    onClick={handleRemoveImage}
                                >
                                    Remove Image
                                </button>
                                <button
                                    type="button"
                                    className="text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none"
                                    onClick={openImageInNewTab}
                                >
                                    Open Image in New Tab
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="w-full">
                            <label
                                htmlFor="itemName"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Item Name
                            </label>
                            <input
                                type="text"
                                name="itemName"
                                id="itemName"
                                value={product.itemName}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="jobslip"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Job Slip
                            </label>
                            <input
                                type="text"
                                name="jobslip"
                                id="jobslip"
                                value={product.jobslip}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="fabricator"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Fabricator
                            </label>
                            <input
                                type="text"
                                name="fabricator"
                                id="fabricator"
                                value={product.fabricator}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="category"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Category
                            </label>
                            <Select
                                options={categories}
                                value={product.category.map(cat => ({ value: cat, label: cat }))}
                                onChange={handleCategoryChange}
                                multiple
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="sizes"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Sizes
                            </label>
                            <Select
                                options={sizes}
                                value={product.sizes.map(size => ({ value: size, label: size }))}
                                onChange={handleSizeChange}
                                multiple
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="meter"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Meter
                            </label>
                            <input
                                type="text"
                                name="meter"
                                id="meter"
                                value={product.meter}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="status"
                                className="inline-flex items-center mt-3">
                                <input
                                    id="status"
                                    type="checkbox"
                                    name="status"
                                    checked={product.status}
                                    onChange={handleCheckboxChange}
                                    className="h-5 w-5 rounded-md text-primary-600 border-gray-300 focus:ring-primary-600 focus:ring-offset-primary-600"
                                />
                                <span className="ml-2 text-sm text-gray-900">Status</span>
                            </label>
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="clothQuality"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Cloth Quality
                            </label>
                            <input
                                type="text"
                                name="clothQuality"
                                id="clothQuality"
                                value={product.clothQuality}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="clothName"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Cloth Name
                            </label>
                            <input
                                type="text"
                                name="clothName"
                                id="clothName"
                                value={product.clothName}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="clothPurchaseRate"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Cloth Purchase Rate
                            </label>
                            <input
                                type="number"
                                name="clothPurchaseRate"
                                id="clothPurchaseRate"
                                value={product.clothPurchaseRate}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="clothSaleRate"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Cloth Sale Rate
                            </label>
                            <input
                                type="number"
                                name="clothSaleRate"
                                id="clothSaleRate"
                                value={product.clothSaleRate}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="averagePiece"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Average Piece
                            </label>
                            <input
                                type="text"
                                name="averagePiece"
                                id="averagePiece"
                                value={product.averagePiece}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="mrp"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                MRP
                            </label>
                            <input
                                type="number"
                                name="mrp"
                                id="mrp"
                                value={product.mrp}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="fabrication"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Fabrication
                            </label>
                            <input
                                type="text"
                                name="fabrication"
                                id="fabrication"
                                value={product.fabrication}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="discount"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Discount (%)
                            </label>
                            <input
                                type="number"
                                name="discount"
                                id="discount"
                                value={product.discount}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="packingCharge"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Packing Charge
                            </label>
                            <input
                                type="number"
                                name="packingCharge"
                                id="packingCharge"
                                value={product.packingCharge}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="quantities"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Quantities
                            </label>
                            <button
                                type="button"
                                className="text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none"
                                onClick={() => setIsQuantityModalOpen(true)}
                            >
                                Edit Quantities
                            </button>
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="expenses"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Expenses
                            </label>
                            <button
                                type="button"
                                className="text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none"
                                onClick={() => setIsExpenseModalOpen(true)}
                            >
                                Edit Expenses
                            </button>
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="swpr"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                SWPR
                            </label>
                            <button
                                type="button"
                                className="text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none"
                                onClick={() => setIsSwprModalOpen(true)}
                            >
                                Edit SWPR
                            </button>
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="swsr"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                SWSR
                            </label>
                            <button
                                type="button"
                                className="text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none"
                                onClick={() => setIsSwsrModalOpen(true)}
                            >
                                Edit SWSR
                            </button>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Update Product
                        </button>
                    </div>
                </form>
            </div>
            {isQuantityModalOpen && (
                <QuantityModal
                    isOpen={isQuantityModalOpen}
                    onClose={() => setIsQuantityModalOpen(false)}
                    onSave={handleQuantitySave}
                    quantities={product.quantities}
                />
            )}
            {isExpenseModalOpen && (
                <ExpenseModal
                    isOpen={isExpenseModalOpen}
                    onClose={() => setIsExpenseModalOpen(false)}
                    onSave={handleExpenseSave}
                    expenses={product.expenses}
                />
            )}
            {isSWPRModalOpen && (
                <SwprModal
                    isOpen={isSWPRModalOpen}
                    onClose={() => setIsSwprModalOpen(false)}
                    onSave={handleSwprSave}
                    swprValues={product.swpr}
                />
            )}
            {isSWSRModalOpen && (
                <SwsrModal
                    isOpen={isSWSRModalOpen}
                    onClose={() => setIsSwsrModalOpen(false)}
                    onSave={handleSwsrSave}
                    swsrValues={product.swsr}
                />
            )}
        </section>
    );
}
