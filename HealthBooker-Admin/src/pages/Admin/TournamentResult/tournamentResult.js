import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    ShoppingOutlined,
    CheckCircleOutlined,
    StopOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop, Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Modal, Popconfirm,
    Row,
    Space,
    Spin,
    Table,
    notification,
    Select,
    InputNumber
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import tournamentApi from "../../../apis/tournamentApi";
import "./tournamentResult.css";
import fieldtypesApi from '../../../apis/fieldtypesApi';
import uploadFileApi from '../../../apis/uploadFileApi';
import userApi from '../../../apis/userApi';
import { useHistory, useParams } from "react-router-dom";
import areaManagementApi from '../../../apis/areaManagementApi';
import tournamentResultApi from '../../../apis/tournamentResultApi';

const { Option } = Select;

const TournamentResult = () => {

    const [category, setCategory] = useState([]);
    const [fieldTypes, setFieldTypes] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [file, setUploadFile] = useState();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const tournamentInfo = {
                "tournament_id": values.tournament_id,
                "result_info": values.result_info,
                "image": file,
            };

            return tournamentResultApi.addTournamentResult(tournamentInfo).then(response => {
                if (response.message === "Asset with the same name already exists") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên kết quả giải đấu không được trùng',
                    });
                    setLoading(false);
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo kết quả giải đấu thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo kết quả giải đấu thành công',
                    });
                    setOpenModalCreate(false);
                    handleCategoryList();
                }
            })

        } catch (error) {
            throw error;
        }
    }

    const handleUpdateCategory = async (values) => {
        setLoading(true);
        try {
            const tournamentInfo = {
                "tournament_id": values.tournament_id,
                "result_info": values.result_info,
                "image": file,
            };
            return tournamentResultApi.updateTournamentResult(tournamentInfo, id).then(response => {
                if (response.message === "Asset with the same name already exists") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên kết quả giải đấu không được trùng',
                    });
                    setLoading(false);
                    return;
                }

                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa kết quả giải đấu thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa kết quả giải đấu thành công',
                    });
                    setUploadFile();
                    handleCategoryList();
                    setOpenModalUpdate(false);
                }
            })

        } catch (error) {
            throw error;
        }
    }

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false)
        }
        console.log('Clicked cancel button');
    };

    const handleCategoryList = async () => {
        const response = await userApi.getProfile();
        console.log(response);
        setUserData(response.user);

        const createdById = response.user.id;

        if (response.user.role == "isAdmin") {

            await tournamentApi.getAllTournaments().then((res) => {
                console.log(res);
                setCategory(res);
                setLoading(false);
            });
        } else {
            await tournamentApi.getTournamentByUserId(createdById).then((res) => {
                console.log(res);
                setCategory(res);
                setLoading(false);
            });
        }

        await tournamentResultApi.getAllTournamentResults().then((res) => {
            console.log(res);
            setResult(res);
            setLoading(false);
        });

    }

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await tournamentResultApi.deleteTournamentResult(id).then(response => {
                if (response.message === "Cannot delete the asset because it is referenced in another process or event.") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            "Không thể xóa kết quả giải đấu vì nó đã được sử dụng trong một kết quả giải đấu hoặc quá trình khác.",

                    });
                    setLoading(false);
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa kết quả giải đấu thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa kết quả giải đấu thành công',

                    });
                    handleCategoryList();
                    setLoading(false);
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleEditCategory = (id) => {
        console.log(id);
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await tournamentResultApi.getTournamentResultById(id);
                setId(id);
                form2.setFieldsValue({
                    result_info: response.result_info,
                    tournament_id: response.tournament_id,
                });
                console.log(form2);
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    const handleFilter = async (name) => {
        try {
            const res = await tournamentResultApi.searchTournamentResults(name.target.value);
            setCategory(res);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image) => <img src={image} style={{ height: 80 }} />,
            width: '10%',
        },
        {
            title: 'Kết quả',
            dataIndex: 'result_info',
            key: 'result_info',
        },

        {
            title: 'Kết quả',
            dataIndex: 'tournament_name',
            key: 'tournament_name',
        },

        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>

                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            style={{ width: 170, borderRadius: 15, height: 30 }}
                            onClick={() => handleEditCategory(record.id)}
                        >{"Chỉnh sửa"}
                        </Button>
                        <div
                            style={{ marginLeft: 6 }}>
                            <Popconfirm
                                title="Bạn có chắc chắn xóa kết quả giải đấu này?"
                                onConfirm={() => handleDeleteCategory(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    style={{ width: 170, borderRadius: 15, height: 30 }}
                                >{"Xóa"}
                                </Button>
                            </Popconfirm>
                        </div>
                    </Row>
                </div>
            ),
        },
    ];



    const handleChangeImage = async (e) => {
        setLoading(true);
        const response = await uploadFileApi.uploadFile(e);
        if (response) {
            setUploadFile(response);
        }
        setLoading(false);
    }


    const [userData, setUserData] = useState([]);
    const [result, setResult] = useState([]);


    useEffect(() => {
        (async () => {
            try {


                const response = await userApi.getProfile();
                console.log(response);
                setUserData(response.user);

                const createdById = response.user.id;

                if (response.user.role == "isAdmin") {

                    await tournamentApi.getAllTournaments().then((res) => {
                        console.log(res);
                        setCategory(res);
                        setLoading(false);
                    });
                } else {
                    await tournamentApi.getTournamentByUserId(createdById).then((res) => {
                        console.log(res);
                        setCategory(res);
                        setLoading(false);
                    });
                }


                await tournamentResultApi.getAllTournamentResults().then((res) => {
                    console.log(res);
                    setResult(res);
                    setLoading(false);
                });
                ;
            } catch (error) {
                console.log('Failed to fetch category list:' + error);
            }
        })();
    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <ShoppingOutlined />
                                <span>Quản lý kết quả giải đấu</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="18">
                                        {userData.role == "isAdmin" ?

                                            <Input
                                                placeholder="Tìm kiếm theo tên và mô tả"
                                                allowClear
                                                onChange={handleFilter}
                                                style={{ width: 300 }}
                                            /> : null}
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                {userData.role !== "isAdmin" ?

                                                    <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo kết quả giải đấu</Button> : null}

                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table     scroll={{ x: true }}
 columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={result} />
                    </div>
                </div>

                <Modal
                    title="Tạo kết quả giải đấu mới"
                    visible={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                handleOkUser(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => handleCancel("create")}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form}
                        name="tournamentCreate"
                        layout="vertical"
                        initialValues={{
                            status: 'active',
                            approval_status: 'pending',
                        }}
                        scrollToFirstError
                    >
                        <Spin spinning={loading}>

                            <Form.Item
                                name="tournament_id"
                                label="Giải đấu"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn giải đấu!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Select placeholder="Chọn giải đấu">
                                    {category.map(fieldType => (
                                        <Select.Option key={fieldType.id} value={fieldType.id}>
                                            {fieldType.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="result_info"
                                label="Kết quả"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập kết quả!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input.TextArea placeholder="Kết quả" />
                            </Form.Item>


                            <Form.Item
                                name="image"
                                label="Chọn ảnh"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn ảnh!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChangeImage}
                                    id="image"
                                    name="image"
                                />
                            </Form.Item>
                        </Spin>
                    </Form>

                </Modal>

                <Modal
                    title="Chỉnh kết quả giải đấu"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateCategory(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={handleCancel}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form2}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Spin spinning={loading}>
                            <Form.Item
                                name="tournament_id"
                                label="Giải đấu"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn giải đấu!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Select placeholder="Chọn giải đấu">
                                    {category.map(fieldType => (
                                        <Select.Option key={fieldType.id} value={fieldType.id}>
                                            {fieldType.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="result_info"
                                label="Kết quả"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập kết quả!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input.TextArea placeholder="Kết quả" />
                            </Form.Item>


                            <Form.Item
                                name="image"
                                label="Chọn ảnh"
                                style={{ marginBottom: 10 }}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChangeImage}
                                    id="image"
                                    name="image"
                                />
                            </Form.Item>
                        </Spin>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default TournamentResult;