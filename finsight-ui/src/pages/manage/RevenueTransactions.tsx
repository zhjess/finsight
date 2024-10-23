import React, { useMemo, useState } from "react";
import DashBox from "@/components/DashBox";
import DashBoxHeader from "@/components/DashBoxHeader";
import FlexBetween from "@/components/FlexBetween";
import { useCreateRevenueTransactionMutation, useDeleteRevenueTransactionMutation, useGetProductsQuery, useGetRevenueTransactionsQuery, useUpdateRevenueTransactionMutation } from "@/state/api";
import { Box, Button, FormControl, FormLabel, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import CustomModal from "@/components/CustomModal";
import AddButton from "@/components/AddButton";
import { formatDate } from "@/utils/dateUtils";
import PageNumberNav from "@/components/PageNumberNav";

interface FormTransactionProduct {
    productId: string;
    quantity: number;
}

interface FormData {
    date: { day: number; month: number; year: number }; 
    customer: string;
    transactionProducts: FormTransactionProduct[];
}

const RevenueTransactions = () => {
    const { palette } = useTheme();

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 100;
    const [modalType, setModalType] = useState<"add" | "edit" | null>(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        date: { day: new Date().getDate(), month: new Date().getMonth() + 1, year: new Date().getFullYear() }, // today's date
        customer: "",
        transactionProducts: [] as FormTransactionProduct[]
    });
    const [errors, setErrors] = useState({ customer: "", transactionProducts: "" });

    const { data: transactionData, refetch } = useGetRevenueTransactionsQuery({ page: currentPage, limit: limit});
    const { data: productData } = useGetProductsQuery({ page: 1, limit: 1000 }); // to adj as needed
    const [createTransaction] = useCreateRevenueTransactionMutation();
    const [updateTransaction] = useUpdateRevenueTransactionMutation();
    const [deleteTransaction] = useDeleteRevenueTransactionMutation();

    const handleNextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const products = useMemo(() => {
        if (productData) {
            return productData.products.map(product => ({
                id: product.id,
                description: product.description,
                price: (product.price / 100).toFixed(2)
            }));
        }
        return [];
    }, [productData]);

    const resetForm = () => {
        setSelectedTransactionId(null);
        setFormData({ 
            date: { day: new Date().getDate(), month: new Date().getMonth() + 1, year: new Date().getFullYear() },
            customer: "", 
            transactionProducts: [{ productId: "", quantity: 0 }] 
        });
        setErrors({ customer: "", transactionProducts: "" });
    };

    const handleModalOpen = (type: "add" | "edit", transactionId?: string) => {
        setModalType(type);
        if (type === "add") {
            resetForm();
        } else if (type === "edit" && transactionId) {
            const transactionToEdit = transactionData?.transactions?.find((p) => p.id === transactionId);
            if (transactionToEdit) {
                setSelectedTransactionId(transactionToEdit.id);
                const transactionDate = new Date(transactionToEdit.date);
                setFormData({
                    date: { 
                        day: transactionDate.getDate(), 
                        month: transactionDate.getMonth() + 1, 
                        year: transactionDate.getFullYear() 
                    },
                    customer: transactionToEdit.customer || "",
                    transactionProducts: transactionToEdit.transactionProducts || []
                });
            }
        }
    };

    const handleModalClose = () => {
        setModalType(null);
    };

    const handleTransactionProductsChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>, index: number) => {
        const { name, value } = event.target;
        const updatedProducts = [...formData.transactionProducts];

        if (name === "quantity") {
            updatedProducts[index] = { ...updatedProducts[index], [name as string]: value ? Number(value) : "" };
        } else {
            updatedProducts[index] = { ...updatedProducts[index], [name as string]: value };
        }

        setFormData((prev) => {
            const newFormData = { ...prev, transactionProducts: updatedProducts };
            console.log("Updated formData:", newFormData);
            return newFormData;
        });
    };

    const handleAddTransactionProduct = () => {
        setFormData((prev) => ({
            ...prev,
            transactionProducts: [...prev.transactionProducts, { productId: "", quantity: 0 }],
        }));
    };

    const validateForm = () => {
        const newErrors = { customer: "", transactionProducts: "" };
        if (!formData.customer) newErrors.customer = "Customer name is required";

        const productErrors = formData.transactionProducts.map((product) => {
            if (!product.productId || product.quantity <= 0) {
                return "Product name is required and quantity must be greater than 0";
            }
            return "";
        });

        const hasProductErrors = productErrors.some((error) => error !== "");
        if (hasProductErrors) {
            newErrors.transactionProducts = "Product name is required and quantity must be greater than 0";
        }

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === "");
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const date = new Date(formData.date.year, formData.date.month - 1, formData.date.day); // convert d/m/y  selections to date object

            if (modalType === "add") {
                const transactionData = {
                        customer: formData.customer,
                        transactionProducts: formData.transactionProducts,
                        date: date.toISOString(),
                };
                await createTransaction(transactionData);
            } else if (modalType === "edit" && selectedTransactionId) {
                const updatedTransactionData = {
                    customer: formData.customer,
                    transactionProducts: formData.transactionProducts,
                    date: date.toISOString(),
                };
                console.log("updated transaction data", updatedTransactionData);
                await updateTransaction({ id: selectedTransactionId, transaction: updatedTransactionData});
            }
            await refetch();
            handleModalClose();
        } catch (err) {
            console.error("An error occurred while submitting the transaction", err);
        }
    };

    const handleDelete = async () => {
        if (selectedTransactionId) {
            const confirmed = window.confirm("Are you sure you want to delete this transaction?");
            if (confirmed) {
                try {
                    await deleteTransaction(selectedTransactionId);
                    await refetch();
                    handleModalClose();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    };

    const renderEditButton = (params: GridCellParams) => (
        <Box display="flex" height="100%">
            <IconButton
                onClick={() => handleModalOpen("edit", params.row.id as string)}
                sx={{
                    color: palette.grey[800],
                    "&:hover": { color: palette.primary[400] },
                }}
            >
                <EditIcon fontSize="small" />
            </IconButton>
        </Box>
    );

    const transactionColumns = [
        {
            field: "date",
            headerName: "Date",
            flex: 0.6,
            renderCell: (params: any) => {
                const date = new Date(params.value);
                return formatDate(date);
            },
        },
        { field: "customer", headerName: "Customer", flex: 0.5 },
        { field: "id", headerName: "Transaction ID", flex: 1 },
        { field: "edit", headerName: "", flex: 0.1, sortable: false, renderCell: renderEditButton },
    ];

    const renderModalContent = () => {
        // dropdown menu options
        const days = Array.from({ length: 31 }, (_, i) => i + 1);
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - i); // last 10 years
    
        // Calculate the transaction total
        const transactionTotal = formData.transactionProducts.reduce((accumulator, currentValue) => {
            const product = products.find(p => p.id === currentValue.productId);
            const price = product ? parseFloat(product.price) : 0; // Ensure price is a number
            return accumulator + (price * currentValue.quantity);
        }, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
        return (
            <Box margin="2rem 1rem">
                <FormControl fullWidth sx={{ marginBottom: "1.5rem" }}>
                    <FormLabel sx={{ fontSize: "medium", marginBottom: "1.5rem" }}>
                        <b>{modalType === "add" ? "Enter new transaction details:" : "Update existing transaction details:"}</b>
                    </FormLabel>
                    <FormLabel sx={{ fontSize: "small", marginBottom: "1rem"}}>Transaction details:</FormLabel>
                    <Box display="flex" justifyContent="space-between">
                        <FormControl sx={{ flex: 1, marginRight: "1rem" }}>
                            <InputLabel size="small">Day</InputLabel>
                            <Select
                                label="Day"
                                value={formData.date.day || ""}
                                onChange={(e) => setFormData({ ...formData, date: { ...formData.date, day: Number(e.target.value) } })}
                                size="small"
                            >
                                {days.map(day => (
                                    <MenuItem key={day} value={day}>{day}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ flex: 1, marginRight: "1rem" }}>
                            <InputLabel size="small">Month</InputLabel>
                            <Select
                                label="Month"
                                value={formData.date.month || ""}
                                onChange={(e) => setFormData({ ...formData, date: { ...formData.date, month: Number(e.target.value) } })}
                                size="small"
                            >
                                {months.map(month => (
                                    <MenuItem key={month} value={month}>{month}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ flex: 1 }}>
                            <InputLabel size="small">Year</InputLabel>
                            <Select
                                label="Year"
                                value={formData.date.year || ""}
                                onChange={(e) => setFormData({ ...formData, date: { ...formData.date, year: Number(e.target.value) }})}
                                size="small"
                            >
                                {years.map(year => (
                                    <MenuItem key={year} value={year}>{year}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </FormControl>
    
                <FormControl fullWidth>
                    <TextField
                        label="Customer name"
                        name="customer"
                        value={formData.customer}
                        onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                        fullWidth
                        margin="normal"
                        error={!!errors.customer}
                        helperText={errors.customer}
                        slotProps={{ inputLabel: { shrink: true } }}
                        sx={{ marginBottom: "1.5rem" }}
                    />
                    <FormLabel sx={{ fontSize: "small", marginBottom: "1rem"}}>Transaction items:</FormLabel>
                    {formData.transactionProducts.map((transactionProduct, index) => (
                        <Box display="flex" key={index} gap="1rem">
                            <Box flex="3">
                                <FormControl fullWidth sx={{ marginBottom: "1rem"}}>
                                    <InputLabel size="small">Product</InputLabel>
                                    <Select
                                        label="Product"
                                        name="productId"
                                        size="small"
                                        value={transactionProduct.productId}
                                        onChange={(e) => handleTransactionProductsChange(e as React.ChangeEvent<{ name?: string; value: unknown }>, index)}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 300,
                                                    width: 400,
                                                }
                                            }
                                        }}
                                    >   
                                        {products.map((product) => (
                                            <MenuItem key={product.id} value={product.id}>
                                                {`${product.description} | $${product.price} | ${product.id}`}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box flex="1">
                                <TextField
                                    label="Quantity"
                                    name="quantity"
                                    type="number"
                                    size="small"
                                    value={transactionProduct.quantity !== 0 ? transactionProduct.quantity : ""} // prevent from displaying 0
                                    onChange={(e) => handleTransactionProductsChange(e, index)}
                                    fullWidth
                                    margin="none"
                                />
                            </Box>
                        </Box>
                    ))}
                </FormControl>
                <Box marginTop="0.5rem">
                    <Button
                        onClick={handleAddTransactionProduct}
                        sx={{
                            padding: "0.1rem 1rem",
                            color: "white",
                            backgroundColor: palette.grey[400]
                        }}
                        size="large"
                    >
                        <b>+</b>
                    </Button>
                </Box>
                <Box display="flex" justifyContent="flex-end" mt="1.5rem">
                    <Typography variant="h4" fontWeight="bold" color={palette.grey[700]}>Transaction total:</Typography>
                    <Typography variant="h4" fontWeight="bold" color={palette.grey[700]}ml="1.5rem">${transactionTotal}</Typography>
                </Box>

            </Box>
        );
    };
    

    return (
        <DashBox height="90vh">
            <FlexBetween mb="1rem">
                <DashBoxHeader title="Revenue Transactions" />
                <AddButton handler={() => handleModalOpen("add")} />
            </FlexBetween>
            <Box
                m="0.5rem"
                p="0 0.5rem"
                height="88%"
                sx={{
                    "& .MuiDataGrid-root": { color: palette.grey[500], border: "none" },
                    "& .MuiDataGrid-cell": { border: "none", borderBottom: `1px solid ${palette.grey[800]} !important` },
                    "& .MuiDataGrid-columnHeaders": { borderBottom: `1px solid ${palette.grey[800]} !important` },
                    "& .MuiDataGrid-columnSeparator": { visibility: "hidden" },
                }}
            >
                <DataGrid
                    columnHeaderHeight={25}
                    rowHeight={35}
                    hideFooter
                    rows={transactionData?.transactions || []}
                    columns={transactionColumns}
                />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" margin="1.5rem 1rem">
                <PageNumberNav
                    currentPage={currentPage}
                    totalPages={transactionData?.totalPages ?? 0}
                    handlePreviousPage={handlePreviousPage}
                    handleNextPage={handleNextPage}
                />
            </Box>
            <CustomModal
                open={modalType !== null}
                title={modalType === "add" ? "ADD NEW REVENUE TRANSACTION" : "EDIT EXISTING REVENUE TRANSACTION"}
                onSave={handleSubmit}
                onClose={handleModalClose}
                onDelete={modalType === "edit" ? handleDelete : undefined}
                content={renderModalContent()}
            />
        </DashBox>
    );
};

export default RevenueTransactions;
