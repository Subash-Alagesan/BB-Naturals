import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "../../config/axios";
import { Button } from "@mui/material";
import StickyHeader from "../StickyHeader";
import ProductPopover from "./ProductPopover";

const GridForDisplay = () => {
  const visibleColumns = [
    "product_name",
    "stock",
    "categories",
    "price",
    "regular_price",
    "sale_price",
    "actions",
  ];
  const columns = [
    { id: "product_name", label: "Product Name", align: "left", minWidth: 170 },
    { id: "stock", label: "Stock", align: "right", minWidth: 100 },
    { id: "categories", label: "Categories", align: "left", minWidth: 170 },
    { id: "price", label: "Price", align: "right", minWidth: 100 },
    { id: "regular_price", label: "Regular Price", align: "right", minWidth: 100 },
    { id: "sale_price", label: "Sale Price", align: "right", minWidth: 100 },
    {
      id: "actions",
      label: "Actions",
      minWidth: 100,
      align: "right",
      render: (row) => (
        <div>
          <Button onClick={() => handleEditProduct(row)}>Edit</Button>
          <Button onClick={() => handleDeleteProduct(row)}>Delete</Button>
          <Button onClick={() => handleOpenEditPopover(row)}>Edit in Popover</Button>
        </div>
      ),
    },
  ];
  

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({});
  const [editProduct, setEditProduct] = useState(null);
  const [isAddPopoverOpen, setIsAddPopoverOpen] = useState(false);
  const [isEditPopoverOpen, setIsEditPopoverOpen] = useState(false);

  const getProducts = () => {
    axios
      .get("/api/products/getproducts")
      .then((response) => {
        console.log(response);
        setProducts(response.data.data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  };

  useEffect(() => {
    console.log("Fetching products...");
    getProducts();
  }, []);

  const handleOpenAddPopover = () => {
    setNewProduct({}); // Reset the new product form fields
    setIsAddPopoverOpen(true);
  };

  const handleCloseAddPopover = () => {
    setIsAddPopoverOpen(false);
  };

  const handleOpenEditPopover = (product) => {
    setEditProduct(product);
    setIsEditPopoverOpen(true);
  };

  const handleCloseEditPopover = () => {
    setIsEditPopoverOpen(false);
  };

  const handleInputChange = (e, column) => {
    const { id, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [id]: value,
    }));
  };

  const handleSaveNewProduct = async () => {
    if (Object.keys(newProduct).length > 0) {
      try {
        const response = await axios.post(
          "/api/products/addnewproducts",
          newProduct
        );
        console.log("New product added successfully:", response.data);
        getProducts();
        setIsAddPopoverOpen(false);
      } catch (error) {
        console.error("Error adding new product:", error);
      }
    }
  };

  const handleSaveEditedProduct = async () => {
    if (editProduct) {
      try {
        const response = await axios.put(
          `/api/products/editproductlist/${editProduct.id}`,
          editProduct
        );
        console.log("Product updated successfully:", response.data);
        getProducts();
        setIsEditPopoverOpen(false);
        setEditProduct(null);
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
  };

  const handleDeleteProduct = (product) => {
    const updatedProducts = products.filter((p) => p !== product);
    setProducts(updatedProducts);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenAddPopover}
      >
        ADD NEW PRODUCT
      </Button>
      <StickyHeader
        visibleColumns={visibleColumns}
        columns={columns}
        products={products}
        handleAddToCart={() => {
          // You need to implement this function or remove it if not used
        }}
        handleOpenEditPopover={handleOpenEditPopover} // Pass the function here
      />

      {/* Add Product Popover */}
      <ProductPopover
        columns={columns}
        productData={newProduct}
        open={isAddPopoverOpen}
        onClose={handleCloseAddPopover}
        onSubmit={handleSaveNewProduct}
        onChange={handleInputChange}
        title="Add Product"
      />

      {/* Edit Product Popover */}
      <ProductPopover
        columns={columns}
        productData={editProduct}
        open={isEditPopoverOpen}
        onClose={handleCloseEditPopover}
        onSubmit={handleSaveEditedProduct}
        onChange={handleInputChange} // Update this if needed for edit product changes
        title="Edit Product"
      />
    </div>
  );
};

export default GridForDisplay;
