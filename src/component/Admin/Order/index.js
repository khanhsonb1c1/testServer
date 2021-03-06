import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Button, Modal, Spinner, Form, Badge } from "react-bootstrap";

export default function AdminOrder(props) {
    const [allOrder, setAllOrder] = useState([])
    const [displayErrorModal, setDislayErrorModal] = useState({ status: false, error: '', type: '' })
    const [loadingCategory, setLoadingCategory] = useState(false)

    let adminToken = JSON.parse(sessionStorage.getItem('gears-ctm'))

    const getAllOrder = async () => {
        setLoadingCategory(true)

        const getRes = await axios(`${window.SERVER_HOST}/api/cart/get-order`, {
            method: 'GET',
            headers: {
                'auth-token': adminToken.ctm_tk
            },
        })

        if (getRes.data.success) {
            setAllOrder(getRes.data.payload)
        }

        setLoadingCategory(false)
    }


    useEffect(() => {
        getAllOrder()
    }, [])

    const updateStatus = async (status, orderId) => {
        const updateRes = await axios(`${window.SERVER_HOST}/api/cart/update-order-status`, {
            method: 'PUT',
            data : {
                status,
                orderId
            },
            headers: {
                'auth-token': adminToken.ctm_tk
            },
        })

        if ( updateRes.data.success ){
            const order = [...allOrder]
            const findIndex = order.findIndex((item) => Number(item.order_id) === Number(orderId) )
            if ( findIndex >= 0 ){
                order[findIndex].status = status
            }

            setAllOrder(order)
        }
    }

    const renderTable = allOrder.map((orderItem, orderIndex) => {
        return (
            <tr style={{ cursor: 'pointer' }}>
                <td>
                    {orderIndex + 1}
                </td>
                <td>
                    {orderItem.order_customer}
                </td>

                <td>
                    {orderItem.product.map((productItem, productIndex) => {
                        return (
                            <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '5px'}}>
                                <img style={{ width: '8rem', height: '8rem' }} src={`data:image/png;base64, ${productItem.product_image}`} />
                                <div style={{marginLeft: '30px', width: '250px'}}>
                                    <p style={{fontSize: '1.3em'}}>{productItem.product_name}</p>
                                    <p>SL: {productItem.quality}</p>
                                </div>
                            </div>
                        )
                    })}           
                </td>
                <td>{orderItem.create_date}</td>
                <td>{orderItem.price} vn??</td>
                <td>{orderItem.order_address}</td>
                <td>{orderItem.order_phone}</td>
                <td style={{ textAlign: 'center' }}>
                    <div style={{margin: '5px'}}>
                        <Button variant={orderItem.status === 'X??c nh???n' ? 'primary' : 'secondary'}>X??c nh???n</Button>
                    </div>
                    <div style={{margin: '5px'}}>
                        <Button variant={orderItem.status === 'V???n chuy???n' ? 'primary' : 'secondary'}
                            onClick={() => {
                                if ( orderItem.status === 'X??c nh???n' ){
                                    updateStatus('V???n chuy???n', orderItem.order_id)
                                }else{
                                    setDislayErrorModal({status: true, error: 'C???p nh???t tr???ng th??i th???t b???i', type: 'error'})
                                }
                            }}
                        >??ang v???n chuy???n</Button>
                    </div>
                    <div style={{margin: '5px'}}>
                        <Button variant={orderItem.status === 'Ho??n th??nh' ? 'primary' : 'secondary'}
                            onClick={() => {
                                if ( orderItem.status === 'V???n chuy???n' ){
                                    updateStatus('Ho??n th??nh', orderItem.order_id)
                                }else{
                                    setDislayErrorModal({status: true, error: 'C???p nh???t tr???ng th??i th???t b???i', type: 'error'})
                                }
                            }}
                        >???? nh???n h??ng</Button>
                    </div>
                </td>
            </tr>
        )
    })

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', overflow: 'scroll' }} className="categoty-table">
            {displayErrorModal.status ?
                <Modal show={displayErrorModal.status}
                    size="md"
                    centered
                    animation={false}
                    onHide={() => setDislayErrorModal({ status: false, error: '', type: '' })}
                    aria-labelledby="example-modal-sizes-title-sm"
                >
                    <Modal.Body>
                        <div style={{ fontSize: '24px', color: displayErrorModal.type === 'error' ? 'red' : 'blue' }}>{displayErrorModal.error}</div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setDislayErrorModal({ status: false, error: '', type: '' })}>????ng</Button>
                    </Modal.Footer>
                </Modal> : ''
            }

            {
                loadingCategory ? <Spinner animation="border" variant="primary" /> :
                    allOrder.length ?
                        <Table responsive="sm" striped bordered hover >
                            <thead>
                                <tr style={{ whiteSpace: 'nowrap' }}>
                                    <th>STT</th>
                                    <th>T??n kh??ch h??ng</th>
                                    <th>S???n ph???m</th>
                                    <th>Ng??y ?????t h??ng</th>
                                    <th>T???ng ????n h??ng</th>
                                    <th>?????a ch???</th>
                                    <th>S??T</th>
                                    <th>Tr???ng th??i</th>

                                </tr>
                            </thead>
                            <tbody>
                                {renderTable}
                            </tbody>
                        </Table> : <div style={{ fontWeight: '800' }}>Ch??a c?? th??ng tin danh m???c</div>

            }
        </div>
    )
}
