// Added lines to use wp.element instead of importing React
const { Component, render } = wp.element;
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Button, TextField } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';

import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';

const queryClient = new QueryClient();
const prefix = window.location.href.includes('localhost') ? '/wordpress/wp-json' : '/wp-json';

function createData(id, name, system) {
    return {
        id,
        name,
        system
    };
}

const fetchSavedCharacters = async () => {
    const response = await fetch(prefix + '/cg/v1/SavedCharacters');

    return await response.json();
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'name',
        isOption: false,
        disablePadding: false,
        label: 'Personnage',
    },
    {
        id: 'system',
        isOption: false,
        disablePadding: false,
        label: 'Système',
    },
    {
        id: 'options',
        isOption: true,
        disablePadding: false,
        label: 'Options'
    }
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.isOption ? 'center' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                mt: { sm: 2 },
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
            }}
        >
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                Liste des personnages sauvegardés
            </Typography>

        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

function EnhancedTable() {
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);
    const [nameSortingValue, setNameSortingValue] = React.useState("");
    const [systemSortingValue, setSystemSortingValue] = React.useState("");

    const { data: characters = [], isLoading: isLoading = true, refetch: characterQuery } = useQuery({
        queryKey: ["SavedCharacters"],
        queryFn: fetchSavedCharacters,
        refetchOnWindowFocus: true,
        staleTime: 1,
        onError: (err) => console.log(err)
    })

    var mutationDeleteCharacter = useMutation({
        mutationFn: (id) => {
            return axios.post(prefix + '/cg/v1/Delete', JSON.stringify({ id: id }), {
                headers: {
                    "Content-Type": "application/json; charset= UTF-8"
                }
            })
        },
        onSuccess: () => { characterQuery() }
    })

    const translateSystemName = (system) => {
        switch (system) {
            case "v5e":
                return "Vampire : La Mascarade";
            case "dd5e":
                return "D&D 5e";
            default:
                return "Cyberpunk RED";
        }
    }

    useEffect(() => {
        if (!isLoading) {
            let newRows = []
            for (let character of characters) {
                let id = Object.values(character)[0];
                let name = Object.values(character)[1];
                let system = translateSystemName(Object.values(character)[2]);

                newRows.push(createData(id, name, system));
            }
            setRows(newRows);
            handleRequestSort(new Event("cg-auto"), orderBy);
        }
    }, [characters])

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        window.location.href = 'admin.php?page=character-generator&value=' + id;
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () => {
            let filteredRows = rows;
            if (nameSortingValue != "") {
                let tempRows = []
                for (var row of filteredRows) {
                    if (row.name.includes(nameSortingValue))
                        tempRows.push(row);
                }
                filteredRows = tempRows;
            }
            if (systemSortingValue != "") {
                let tempRows = []
                for (var row of filteredRows) {
                    if (row.system.includes(systemSortingValue))
                        tempRows.push(row);
                }
                filteredRows = tempRows;
            }
            return stableSort(filteredRows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            )
        },
        [order, orderBy, page, rowsPerPage, rows, nameSortingValue, systemSortingValue],
    );

    const deleteCharacter = (e, id) => {
        console.log("Suppression du personnage " + id)
        e.stopPropagation();

        mutationDeleteCharacter.mutate(id);
    }

    return (
        !isLoading && <Box sx={{ width: '100%', m: '1rem' }}>
            <TextField variant="filled" label="Rechercher un personnage" type="" onChange={(e) => { setNameSortingValue(e.target.value); }} sx={{ mr: "0.5rem" }}></TextField>
            <TextField variant="filled" label="Rechercher un système" type="" onChange={(e) => { setSystemSortingValue(e.target.value); }}></TextField>
            <Paper sx={{ width: '90%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.id)}
                                        tabIndex={-1}
                                        key={row.id}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            align="left"
                                        >
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="left">{row.system}</TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" sx={{ backgroundColor: "red" }} onClick={(e) => { deleteCharacter(e, row.id) }}>Supprimer le personnage</Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage={"Personnages à afficher par page"}
                />
            </Paper>
        </Box>
    );
}

function CharactersTable() {
    return (
        <QueryClientProvider client={queryClient}>
            <EnhancedTable />
        </QueryClientProvider>
    );
}

render(
    <CharactersTable />,
    document.getElementById('cg-saved-characters')
);