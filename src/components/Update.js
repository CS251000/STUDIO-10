import React, { useState, useEffect } from "react";
import Select from "react-tailwindcss-select";
import QuantityUpModal from "./QuantityUp";
import ExpenseUpModal from "./ExpenseUp";
import { db, storage } from "../firebaseConfig";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import SwprUpModal from "./SWPRUP";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import SwsrUpModal from "./SWSRup";
import { RotatingLines } from "react-loader-spinner";
import { categories } from "../lib/constants";
import { expenses } from "../lib/constants";
import { sizes } from "../lib/constants";
import { getFields, getSuggestions, saveField } from "../idb";

export default function UpdateItem() {
  const { id } = useParams();

  const [userId, setUserId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [product, setProduct] = useState({
    itemName: "",
    itemName: "",
    itempurchase: "",
    itemsale:"",
    jobslip: "",
    fabricator: "",
    category: [],
    sizes: [],
    meter: "",
    status: false,
    clorsh: false, //false = cl, true= sh
    clothQuality: "",
    clothName: "",
    millName: "",
    clothPurchaseRate: "",
    clothSaleRate: "",
    averagePiece: "",
    clothagent: "",
    mrp: "",
    fabrication: "",
    discount: "",
    packingCharge: "",
    quantities: [],
    expenses: [],
    swpr: [],
    swsr: [],
    imageUrl: "",
    createdAt: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
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
        user: userId,
      }));
    }
  }, [userId]);

  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isSWPRModalOpen, setIsSwprModalOpen] = useState(false);
  const [isSWSRModalOpen, setIsSwsrModalOpen] = useState(false);

  const [cachedFields, setCachedFields] = useState({});

  useEffect(() => {
    const loadCachedFields = async () => {
      const fields = await getFields();
      const fieldMap = fields.reduce((acc, { fieldName, value }) => {
        acc[fieldName] = value;
        return acc;
      }, {});
      setCachedFields(fieldMap);
    };

    loadCachedFields();
  }, []);

  const [suggestions, setSuggestions] = useState({});

  const handleItemChange=(e)=>{
    const {name,value}= e.target;
    setProduct((prev)=>({...prev,[name]:value}));
  }

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));

    if (value.trim() !== "") {
      const fetchedSuggestions = await getSuggestions(name, value);
      setSuggestions((prev) => ({ ...prev, [name]: fetchedSuggestions }));
    } else {
      // Clear suggestions if input is empty
      setSuggestions((prev) => ({ ...prev, [name]: [] }));
    }
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    if (value.trim()) {
      await saveField(name, value);
    }

    setTimeout(() => {
      setSuggestions((prev) => ({ ...prev, [name]: [] }));
    }, 150);
  };

  const handleSuggestionClick = (name, item) => {
    setProduct((prev) => ({
      ...prev,
      [name]: item,
    }));
    // Clear suggestions after selection
    setSuggestions((prev) => ({ ...prev, [name]: [] }));
  };

  const handleCategoryChange = (selectedOptions) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      category: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleSizeChange = (selectedOptions) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      sizes: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleCheckboxChange = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      status: !prevProduct.status,
    }));
  };
  const handleCheckboxChange2 = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      clorsh: !prevProduct.clorsh,
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
      newTab.document.body.innerHTML = `<img src="${URL.createObjectURL(
        selectedFile
      )}" />`;
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
  };

  const navigate = useNavigate();

  const handleQuantitySave = (quantities) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      quantities,
    }));
  };

  const handleSwprSave = (swprValues) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      swpr: swprValues,
    }));
  };
  const handleSwsrSave = (swsrValues) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      swsr: swsrValues,
    }));
    const avg =
      swsrValues.reduce((acc, value) => acc + value, 0) / swsrValues.length;
    setProduct((prevProduct) => ({
      ...prevProduct,
      mrp: `${parseFloat(avg.toFixed(2)) * 3}`,
    }));
  };

  const handleExpenseSave = (expenseValues) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      expenses: expenseValues,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (selectedFile) {
      const storageRef = ref(storage, `images/${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error uploading image: ", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          try {
            const docRef = await updateDoc(doc(db, "products", id), {
              ...product,
              imageUrl: downloadURL,
            });
            console.log("Document written with ID: ", docRef.id);
            setTimeout(() => {
              setIsLoading(false);
              navigate("/");
            }, 2000);
          } catch (error) {
            console.error("Error updating document: ", error);
            setIsLoading(false);
          }
        }
      );
    } else {
      try {
        const docRef = await updateDoc(doc(db, "products", id), product);
        console.log("Document written with ID: ", docRef.id);
        setTimeout(() => {
          setIsLoading(false);
          navigate("/");
        }, 2000);
      } catch (error) {
        console.error("Error updating document: ", error);
        setIsLoading(false);
      }
    }
    navigate("/");
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
  const totalExpenses = product.expenses.reduce(
    (acc, expense) => acc + expense,
    0
  );
  const ratecost = (
    Number(product.averagePiece) * Number(product.clothSaleRate) +
    Number(totalExpenses) +
    Number(product.fabrication)
  ).toFixed(2);
  let np = 0;

  for (let i = 0; i < product.swsr.length; i++) {
    np +=
      product.swsr[i] * (1 - 0.01 * product.discount) -
      product.swpr[i] -
      product.packingCharge;
  }
  np /= product.swsr.length.toFixed(2);

  const cp = product.clothSaleRate - product.clothPurchaseRate - 2;

  return (
    <section className="bg-white p-3">
      <div className="max-w-2xl mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6">Update Product</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                onBlur={handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Enter item name"
              />
              {suggestions.itemName && suggestions.itemName.length > 0 && (
                <ul className="absolute z-10 bg-slate-800 border border-gray-300 mt-1 w-auto rounded-md shadow-md max-h-40 overflow-y-auto text-white">
                  {suggestions.itemName.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick("itemName", item)}
                      className="p-2 hover:bg-gray-600 text-white cursor-pointer"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="itempurchase"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Item Purchase
              </label>
              <input
                type="number"
                name="itempurchase"
                id="itempurchase"
                value={product.itempurchase}
                onChange={handleItemChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="itemsale"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Item Sale
              </label>
              <input
                type="number"
                name="itemsale"
                id="itemsale"
                value={product.itemsale}
                onChange={handleItemChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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
                placeholder="Enter job slip"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="createdAt"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Update Date
              </label>
              <input
                type="date"
                name="createdAt"
                id="createdAt"
                value={product.createdAt}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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
                onBlur={handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Enter fabricator"
              />
              {suggestions.fabricator && suggestions.fabricator.length > 0 && (
                <ul className="absolute z-10 bg-slate-800 border border-gray-300 mt-1 w-auto rounded-md shadow-md max-h-40 overflow-y-auto text-white">
                  {suggestions.fabricator.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick("fabricator", item)}
                      className="p-2 hover:bg-gray-600 text-white cursor-pointer"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Category
              </label>
              <Select
                value={product.category.map((cat) => ({
                  value: cat,
                  label: cat,
                }))}
                options={categories}
                onChange={handleCategoryChange}
                isMultiple
                name="category"
                id="category"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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
                value={product.sizes.map((size) => ({
                  value: size,
                  label: size,
                }))}
                options={sizes}
                onChange={handleSizeChange}
                isMultiple
                name="sizes"
                id="sizes"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="meter"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Cloth Meter
              </label>
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
              <label
                htmlFor="meter"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Cloth Agent
              </label>
              <input
                type="text"
                name="clothagent"
                id="clothagent"
                value={product.clothagent}
                onChange={handleChange}
                onBlur={handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Update agent"
              />
              {suggestions.clothagent && suggestions.clothagent.length > 0 && (
                <ul className="absolute z-10 bg-slate-800 border border-gray-300 mt-1 w-auto rounded-md shadow-md max-h-40 overflow-y-auto text-white">
                  {suggestions.clothagent.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick("clothagent", item)}
                      className="p-2 hover:bg-gray-600 text-white cursor-pointer"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="status"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Status
              </label>
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
              <label className="inline-flex items-center mb-5 cursor-pointer">
                <span className="ms-3 me-3 text-lg font-large text-gray-900">
                  CPO
                </span>
                <input
                  type="checkbox"
                  name="clorsh"
                  checked={product.clorsh}
                  onChange={handleCheckboxChange2}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-lg font-large text-gray-900">
                  SPO
                </span>
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
                onBlur={handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Enter cloth quality"
              />
              {suggestions.clothQuality &&
                suggestions.clothQuality.length > 0 && (
                  <ul className="absolute z-10 bg-slate-800 border border-gray-300 mt-1 w-auto rounded-md shadow-md max-h-40 overflow-y-auto text-white">
                    {suggestions.clothQuality.map((item, index) => (
                      <li
                        key={index}
                        onClick={() =>
                          handleSuggestionClick("clothQuality", item)
                        }
                        className="p-2 hover:bg-gray-600 text-white cursor-pointer"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
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
                onBlur={handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Enter cloth name"
              />
              {suggestions.clothName && suggestions.clothName.length > 0 && (
                <ul className="absolute z-10 bg-slate-800 border border-gray-300 mt-1 w-auto rounded-md shadow-md max-h-40 overflow-y-auto text-white">
                  {suggestions.clothName.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick("clothName", item)}
                      className="p-2 hover:bg-gray-600 text-white cursor-pointer"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* <div className="w-full">
                            <label htmlFor="millName" className="block mb-2 text-sm font-medium text-gray-900">Mill Name</label>
                            <input
                                type="text"
                                name="millName"
                                id="millName"
                                value={product.millName}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Enter Mill name"
                                
                            />
                        </div> */}

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
                placeholder="Enter cloth purchase rate"
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
                placeholder="Enter cloth sale rate"
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
              <label
                htmlFor="desc"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Description
              </label>
              <textarea
                name="desc"
                id="desc"
                value={product.desc}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Enter Description"
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
              <label
                htmlFor="discount"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Discount
              </label>
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
                placeholder="Enter packing charge"
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Quantities</h3>
            <div className="flex items-center justify-between mb-2">
              <span>Total Quantity: {totalQuantity}</span>
              <button
                type="button"
                className="text-white bg-blue-500 hover:bg-blue-600 focus:ring focus:ring-blue-300 px-4 py-2 rounded-lg transition"
                onClick={() => setIsQuantityModalOpen(true)}
              >
                Update Quantities
              </button>
            </div>
            <QuantityUpModal
              isOpen={isQuantityModalOpen}
              onClose={() => setIsQuantityModalOpen(false)}
              onSave={handleQuantitySave}
              sizes={product.sizes}
              quantities2={product.quantities}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Expenses</h3>
            <div className="flex items-center justify-between mb-2">
              <span>Total Expenses: {totalExpenses}</span>
              <button
                type="button"
                className="text-white bg-blue-500 hover:bg-blue-600 focus:ring focus:ring-blue-300 px-4 py-2 rounded-lg transition"
                onClick={() => setIsExpenseModalOpen(true)}
              >
                Update Expenses
              </button>
            </div>
            <ExpenseUpModal
              isOpen={isExpenseModalOpen}
              onClose={() => setIsExpenseModalOpen(false)}
              onSave={handleExpenseSave}
              expenses2={product.expenses}
              availableExpenses={expenses}
            />
          </div>
          <div>
            <span className="font-semibold">Rate Cost:</span> {ratecost}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">SWPR</h3>
            <button
              type="button"
              className="text-white bg-blue-500 hover:bg-blue-600 focus:ring focus:ring-blue-300 px-4 py-2 rounded-lg transition"
              onClick={() => setIsSwprModalOpen(true)}
            >
              Update SWPR
            </button>
            <SwprUpModal
              isOpen={isSWPRModalOpen}
              onClose={() => setIsSwprModalOpen(false)}
              onSave={handleSwprSave}
              sizes={product.sizes}
              swpr2={product.swpr}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">SWSR</h3>
            <button
              type="button"
              className="text-white bg-green-700 hover:bg-green-600 focus:ring focus:ring-blue-300 px-4 py-2 rounded-lg transition"
              onClick={() => setIsSwsrModalOpen(true)}
            >
              Update SWSR
            </button>
            <SwsrUpModal
              isOpen={isSWSRModalOpen}
              onClose={() => setIsSwsrModalOpen(false)}
              onSave={handleSwsrSave}
              sizes={product.sizes}
              swsr2={product.swsr}
            />
          </div>
          <div className="w-52 mt-10">
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
              // value={newmrp}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Enter MRP"
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
                  <button
                    type="button"
                    className="ml-4 text-primary-600 underline"
                    onClick={openImageInNewTab}
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    className="ml-2 text-red-600 underline"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Calculated Costs</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Net Profit:</span>{" "}
                {np.toFixed(2)}
              </div>
              <div>
                <span className="font-semibold">Cloth Profit:</span> {cp}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-yellow-500 text-black py-2 px-4 rounded-lg hover:bg-primary-700 transition duration-200"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
