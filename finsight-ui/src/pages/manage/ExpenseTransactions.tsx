import React, { useState } from "react";
import DashBox from "@/components/DashBox";
import DashBoxHeader from "@/components/DashBoxHeader";
import FlexBetween from "@/components/FlexBetween";
import { useCreateExpenseTransactionMutation, useDeleteExpenseTransactionMutation, useGetExpenseCategoriesQuery, useGetExpenseTransactionsQuery, useUpdateExpenseTransactionMutation } from "@/state/api";
import { Box, FormControl, FormHelperText, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import CustomModal from "@/components/CustomModal";
import AddButton from "@/components/AddButton";
import { formatDate } from "@/utils/dateUtils";
import PageNumberNav from "@/components/PageNumberNav";

// interface FormData {
//     date: { day: number; month: number; year: number }; 
//     counterparty: string;
//     amount: string;
//     expenseCategoryId: string;
// }

const ExpenseTransactions = () => {
    const { palette } = useTheme();

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 35;
    const [modalType, setModalType] = useState<"add" | "edit" | null>(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        date: { day: new Date().getDate(), month: new Date().getMonth() + 1, year: new Date().getFullYear() }, // today's date
        counterparty: "",
        amount: "",
        expenseCategoryId: ""
    });
    const [errors, setErrors] = useState({ counterparty: "", amount: "", expenseCategory: "" });

    const { data: transactionData, refetch } = useGetExpenseTransactionsQuery({ page: currentPage, limit: limit });
    const { data: expenseCategoryData } = useGetExpenseCategoriesQuery();
    const [createTransaction] = useCreateExpenseTransactionMutation();
    const [updateTransaction] = useUpdateExpenseTransactionMutation();
    const [deleteTransaction] = useDeleteExpenseTransactionMutation();

    React.useEffect(() => {
        refetch(); // refetch when currentPage changes
    }, [currentPage, refetch]);

    const handleNextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const resetForm = () => {
        setSelectedTransactionId(null);
        setFormData({ 
            date: { day: new Date().getDate(), month: new Date().getMonth() + 1, year: new Date().getFullYear() },
            counterparty: "", 
            amount: "",
            expenseCategoryId: ""
        });
        setErrors({ counterparty: "", amount: "", expenseCategory: "" });
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
                    counterparty: transactionToEdit.counterparty || "",
                    amount: (transactionToEdit.amount / 100).toFixed(2) || "",
                    expenseCategoryId: transactionToEdit.expenseCategoryId || ""
                });
            }
        }
    };

    const handleModalClose = () => {
        setModalType(null);
    };

    const handleExpenseCategoryChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const value = event.target.value as string;

        setFormData((prev) => ({ ...prev, expenseCategoryId: value }));
        setErrors((prev) => ({ ...prev, expenseCategory: "" })); // Clear error when category is selected
    };

    const validateForm = () => {
        const newErrors = { counterparty: "", amount: "", expenseCategory: "" };
        if (!formData.counterparty) newErrors.counterparty = "Counterparty name is required";
        if (!formData.amount) newErrors.amount = "Expense amount is required";
        if (!formData.expenseCategoryId) newErrors.expenseCategory = "Expense category is required";

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === "");
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const date = new Date(formData.date.year, formData.date.month - 1, formData.date.day); // convert d/m/y selections to date object

            if (modalType === "add") {
                const transactionData = {
                    date: date.toISOString(),
                    counterparty: formData.counterparty,
                    amount: Math.round(parseFloat(formData.amount) * 100),
                    expenseCategoryId: formData.expenseCategoryId
                };
                await createTransaction(transactionData);
            } else if (modalType === "edit" && selectedTransactionId) {
                const updatedTransactionData = {
                    counterparty: formData.counterparty,
                    amount: Math.round(parseFloat(formData.amount) * 100),
                    expenseCategoryId: formData.expenseCategoryId,
                    date: date.toISOString(),
                };
                console.log("updated transaction data", updatedTransactionData);
                await updateTransaction({ id: selectedTransactionId, transaction: updatedTransactionData });
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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        // letters, numbers, and spaces
        const nameRegex = /^[a-zA-Z0-9\s]*$/;
        // numbers only, 2 d.p
        const priceRegex = /^\d*\.?\d{0,2}$/;

        let isValid = true;

        if (name === "description") {
            isValid = nameRegex.test(value);
        } else if (name === "expense" || name === "price") {
            isValid = priceRegex.test(value);
        }

        if (isValid) {
            setFormData((prev) => ({ ...prev, [name]: value }));
            setErrors((prev) => ({ ...prev, [name]: "" }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: "Invalid input" }));
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
            flex: 0.5,
            renderCell: (params: any) => {
                const date = new Date(params.value);
                return formatDate(date);
            },
        },
        { field: "counterparty", headerName: "Counterparty", flex: 0.5 },
        { field: "expenseCategory", headerName: "Category", flex: 0.5, valueFormatter: (value: any) => value.description },
        { field: "edit", headerName: "", flex: 0.1, sortable: false, renderCell: renderEditButton },
    ];

    const renderModalContent = () => {
        // dropdown menu options
        const days = Array.from({ length: 31 }, (_, i) => i + 1);
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - i); // last 10 years

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
                                onChange={(e) => setFormData({ ...formData, date: { ...formData.date, year: Number(e.target.value) } })}
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
                        label="Counterparty name"
                        name="counterparty"
                        value={formData.counterparty}
                        onChange={(e) => setFormData({ ...formData, counterparty: e.target.value })}
                        fullWidth
                        margin="normal"
                        error={!!errors.counterparty}
                        helperText={errors.counterparty}
                        slotProps={{ inputLabel: { shrink: true } }}
                        sx={{ marginBottom: "1.5rem" }}
                    />
                    <FormControl fullWidth sx={{ marginBottom: "1rem"}}>
                        <InputLabel>Expense category</InputLabel>
                            <Select
                                label="Expense category"
                                name="expenseCategory"
                                value={formData.expenseCategoryId}
                                onChange={(e) => handleExpenseCategoryChange(e as React.ChangeEvent<{ name?: string; value: unknown }>)}
                                error={!!errors.expenseCategory}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 300,
                                            width: 400,
                                        }
                                    }
                                }}
                            >   
                                {expenseCategoryData?.map((expenseCategory) => (
                                    <MenuItem key={expenseCategory.id} value={expenseCategory.id}>
                                        {`${expenseCategory.description}`}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.expenseCategory && <FormHelperText error>{errors.expenseCategory}</FormHelperText>}
                    </FormControl>
                    <TextField
                        label="Expense"
                        name="amount"
                        type="text"
                        value={formData.amount}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        error={!!errors.amount}
                        helperText={errors.amount}
                        slotProps={{
                            input: { startAdornment: <InputAdornment position="start">$</InputAdornment> }
                        }}
                    />
                </FormControl>
            </Box>
        );
    };

    return (
        <DashBox height="90vh">
            <FlexBetween mb="1rem">
                <DashBoxHeader title="Expense Transactions" />
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
                title={modalType === "add" ? "ADD NEW EXPENSE TRANSACTION" : "EDIT EXISTING EXPENSE TRANSACTION"}
                onSave={handleSubmit}
                onClose={handleModalClose}
                onDelete={modalType === "edit" ? handleDelete : undefined}
                content={renderModalContent()}
            />
        </DashBox>
    );
};

export default ExpenseTransactions;
