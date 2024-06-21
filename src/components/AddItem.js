import React, { useState } from 'react';
import Select from 'react-tailwindcss-select';
import QuantityModal from './Quantity';
import ExpenseModal from './ExpenseModal';


export default function AddItem() {
    const categories = [
        { value: "print", label: "Print" },
        { value: "plain", label: "Plain" },
        { value: "denim", label: "Denim" },
        { value: "check", label: "Check" },
        { value: "lycra", label: "Lycra" },
        { value: "kurta", label: "Kurta" }
    ];

    const sizes = [
        { value: 's', label: "S" },
        { value: 'm', label: "M" },
        { value: 'l', label: "L" },
        { value: 'xl', label: "XL" },
        { value: 'xxl', label: "XXL" }
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
        
    ];

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
        margin: '',
        discount: '',
        packingCharge: '',
        quantities: [],
        expenses: [],
    });

    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

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

    const handleQuantitySave = (quantities) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            quantities
        }));
    };

    const handleExpenseSave = (expenseValues) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            expenses: expenseValues
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(product);
    };

    const totalQuantity = product.quantities.reduce((acc, qty) => acc + qty, 0);
    const totalExpenses = product.expenses.reduce((acc, expense) => acc + expense, 0);

    return (
        <section className="bg-white">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900">Add a new product</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label
                            htmlFor="formFile"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Add Image
                        </label>
                        <input
                            className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
                            type="file"
                            id="formFile"
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                        <div className="sm:col-span-2">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Item Name</label>
                            <input
                                type="text"
                                name="itemName"
                                id="name"
                                value={product.itemName}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Type product name"
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
                                placeholder="Enter Value..."
                            />
                        </div>
                        <div className="w-full">
                            <label className="inline-flex items-center mb-5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={product.status}
                                    onChange={handleCheckboxChange}
                                    className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-lg font-large text-gray-900">Active</span>
                            </label>
                        </div>
                        <div className="w-full">
                            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">Select an option</label>
                            <Select
                                name="category"
                                id="category"
                                value={categories.filter(category => product.category.includes(category.value))}
                                onChange={handleCategoryChange}
                                isMultiple={true}
                                options={categories}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="sizes" className="block mb-2 text-sm font-medium text-gray-900">Sizes</label>
                            <Select
                                name="sizes"
                                id="sizes"
                                value={sizes.filter(size => product.sizes.includes(size.value))}
                                onChange={handleSizeChange}
                                isMultiple={true}
                                options={sizes}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="meter" className="block mb-2 text-sm font-medium text-gray-900">Cloth Meter</label>
                            <input
                                type="number"
                                name="meter"
                                id="meter"
                                value={product.meter}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="0.0"
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
                            <label htmlFor="fabricator" className="block mb-2 text-sm font-medium text-gray-900">Fabricator</label>
                            <input
                                type="text"
                                name="fabricator"
                                id="fabricator"
                                value={product.fabricator}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Enter value..."
                            />
                        </div>
                        <div className='flex justify-around'>
                    <button
                        type="button"
                        onClick={() => setIsQuantityModalOpen(true)}
                        className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-blue-500"
                    >
                        {totalQuantity > 0 ? `Total Quantity: ${totalQuantity}` : 'Add Quantities'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsExpenseModalOpen(true)}
                        className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-blue-500"
                    >
                        {totalExpenses > 0 ? `Total Expenses: ${totalExpenses}` : 'Add Expenses'}
                    </button>
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
                                placeholder="Enter fabrication cost"
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="margin" className="block mb-2 text-sm font-medium text-gray-900">Margin</label>
                            <input
                                type="number"
                                name="margin"
                                id="margin"
                                value={product.margin}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Enter margin percentage"
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
                    
                    <button
                        type="submit"
                        className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-blue-500"
                    >
                        Add product
                    </button>
                </form>
            </div>
            <QuantityModal
                isOpen={isQuantityModalOpen}
                onClose={() => setIsQuantityModalOpen(false)}
                sizes={sizes.filter(size => product.sizes.includes(size.value))}
                onSave={handleQuantitySave}
            />
            <ExpenseModal
                isOpen={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
                expenses={expenses}
                onSave={handleExpenseSave}
            />
        </section>
    );
}
