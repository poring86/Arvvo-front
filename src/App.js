import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

import { config } from './config'

import { Row, Col, Radio, Spin, Input, Button, Table } from 'antd'
const { Search } = Input

const App = () => {

    const [databases, setDatabases] = useState([])
    const [tables, setTables] = useState([])
    const [columns, setColumns] = useState([])
    const [filteredColumns, setFilteredColumns] = useState(columns)
    const [filter, setFilter] = useState(columns)
    const [selectedDatabase, setSelectedDatabase] = useState(null)
    const [selectedTable, setSelectedTable] = useState(null)

    const loadTables = async (id) => {
        setTables([])
        const tables = await axios.get(`${config.baseUrl}/tables/${id}`)
        setTables(tables.data)
    }

    const loadColumns = async (id) => {
        let columns = await axios.get(`${config.baseUrl}/columns/${id}`)
        columns = columns.data
        console.log(columns)
        setColumns(columns)
        setFilteredColumns(columns)
    }

    const loadData = async () => {
        const databases = await axios.get(`${config.baseUrl}/databases`)
        setDatabases(databases.data)
        setSelectedDatabase(databases.data[0]._id)

        const tables = await axios.get(`${config.baseUrl}/tables/${databases.data[0]._id}`)
        setTables(tables.data)
        setSelectedTable(tables.data[0]._id)

        const columns = await axios.get(`${config.baseUrl}/columns/${tables.data[0]._id}`)
        setColumns(columns.data)
        setFilteredColumns(columns.data)
    }

    const filterHandler = (value) => {
        setFilter(value)
        if (value !== '') {
            let filteredValues = columns.filter(column => column.name.toLowerCase().includes(value.toLowerCase()))
            setFilteredColumns(filteredValues)
        }
        else {
            setFilteredColumns(columns)
        }
    }

    const retrieveAllHandler = async () => {
        const columns = await axios.get(`${config.baseUrl}/columns`)
        console.log(columns.data)
        setColumns(columns.data)
        setSelectedDatabase(null)
        setFilteredColumns(columns.data)
        setTables([])
    }

    const componentColumns = [
        {
            title: 'Id',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Table Name',
            dataIndex: 'tableName',
            key: 'tableName',
        },
        {
            title: 'Database Name',
            dataIndex: 'databaseName',
            key: 'databaseName',
        },
    ]

    useEffect(() => {
        loadData()
    }, [])

    return (
        <div className="App">
            <br /><br />
            <Row type="flex" justify="center">
                <Col span={24}>
                    <Button danger={true} onClick={retrieveAllHandler}>Retrieve All</Button>
                    <br /><br />

                    {databases.length > 0 ? (
                        <>
                            Select Database:
                            <br />
                            <Radio.Group value={selectedDatabase} onChange={(e) => {
                                loadTables(e.target.value)
                                setColumns([])
                                setSelectedTable(null)
                                setSelectedDatabase(e.target.value)
                            }}>
                                {databases.map((db) => (
                                    <Radio.Button key={db._id} value={db._id}>
                                        {db.name}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                            <br />
                        </>

                    ) : (
                        <Spin />
                    )}
                    <br />
                    {tables.length > 0 ? (
                        <>
                            Select Table:
                            <br />
                            <Radio.Group value={selectedTable} onChange={(e) => {
                                loadColumns(e.target.value)
                                setSelectedTable(e.target.value)
                            }}>
                                {tables.map((table) => (
                                    <Radio.Button key={table._id} value={table._id}>
                                        {table.name}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </>
                    ) : (
                        <>
                            {selectedDatabase && (
                                <Spin />
                            )}
                        </>
                    )}
                    <br /><br />
                    <Search value={filter} onChange={(e) => { filterHandler(e.target.value) }} />
                    <br /><br />
                    Columns table:<br />
                    <Table dataSource={filteredColumns} columns={componentColumns} />
                </Col>
            </Row>

        </div>
    )

}

export default App;