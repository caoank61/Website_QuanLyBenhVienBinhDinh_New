import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    ScheduleOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop,
    Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Spin,
    Table,
    notification,
    DatePicker,
    TimePicker
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import scheduleAPI from '../../../apis/scheduleAPI';
import userApi from '../../../apis/userApi';
import "./scheduleManagement.css";
import courtsManagementApi from '../../../apis/courtsManagementApi';
import fieldTypesApi from '../../../apis/fieldtypesApi';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

const { Option } = Select;

const ScheduleManagement = () => {
    const [schedules, setSchedules] = useState();
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [userData, setUserData] = useState([]);
    const [description, setDescription] = useState();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkSchedule = async (values) => {
        setLoading(true);
        try {
            const scheduleData = {
                date: values.date.format('YYYY-MM-DD'),
                shift: values.shift,
                doctor_id: values.doctor_id,
                department_id: values.department_id,
                start_time: values.start_time.format('HH:mm'),
                end_time: values.end_time.format('HH:mm'),
                note: description,
                status: values.status,
                created_by: userData.id,
            };
            const response = await scheduleAPI.addSchedule(scheduleData);
            console.log(response)
            if (response) {
                notification["success"]({
                    message: `Thông báo`,
                    description: 'Tạo lịch trực thành công',
                });
                setOpenModalCreate(false);
                handleScheduleList();
            } else {
                notification["error"]({
                    message: `Thông báo`,
                    description: response.message || 'Tạo lịch trực thất bại',
                });
            }
        } catch (error) {
            console.error('Failed to create schedule: ', error);
            notification["error"]({
                message: `Thông báo`,
                description: 'Đã xảy ra lỗi khi tạo lịch trực',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSchedule = async (values) => {
        setLoading(true);
        try {
            const scheduleData = {
                date: values.date.format('YYYY-MM-DD'),
                shift: values.shift,
                doctor_id: values.doctor_id,
                department_id: values.department_id,
                start_time: values.start_time.format('HH:mm'),
                end_time: values.end_time.format('HH:mm'),
                note: values.note,
                status: values.status,
                created_by: values.created_by,
            };
            const response = await scheduleAPI.updateSchedule(id, scheduleData);
            if (response) {
                notification["success"]({
                    message: `Thông báo`,
                    description: 'Cập nhật lịch trực thành công',
                });
                setOpenModalUpdate(false);
                handleScheduleList();
            } else {
                notification["error"]({
                    message: `Thông báo`,
                    description: response.message || 'Cập nhật lịch trực thất bại',
                });
            }
        } catch (error) {
            console.error('Failed to update schedule: ', error);
            notification["error"]({
                message: `Thông báo`,
                description: 'Đã xảy ra lỗi khi cập nhật lịch trực',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false);
        }
    };

    const handleScheduleList = async () => {
        try {
            setLoading(true);
            const res = await scheduleAPI.getAllSchedules();
            console.log(res)
            setSchedules(res);
        } catch (error) {
            console.error('Failed to fetch schedule list: ', error);
            notification["error"]({
                message: `Thông báo`,
                description: 'Đã xảy ra lỗi khi lấy danh sách lịch trực',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSchedule = async (id) => {
        setLoading(true);
        try {
            const response = await scheduleAPI.deleteSchedule(id);
            if (response) {
                notification["success"]({
                    message: `Thông báo`,
                    description: 'Xóa lịch trực thành công',
                });
                handleScheduleList();
            } else {
                notification["error"]({
                    message: `Thông báo`,
                    description: response.message || 'Xóa lịch trực thất bại',
                });
            }
        } catch (error) {
            console.error('Failed to delete schedule: ', error);
            notification["error"]({
                message: `Thông báo`,
                description: 'Đã xảy ra lỗi khi xóa lịch trực',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEditSchedule = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await scheduleAPI.getScheduleById(id);
                setId(id);
                form2.setFieldsValue({
                    date: moment(response.date),
                    shift: response.shift,
                    doctor_id: response.doctor_id,
                    department_id: response.department_id,
                    start_time: moment(response.start_time, 'HH:mm'),
                    end_time: moment(response.end_time, 'HH:mm'),
                    note: response.note,
                    status: response.status,
                    created_by: response.created_by,
                });
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch schedule: ', error);
                notification["error"]({
                    message: `Thông báo`,
                    description: 'Đã xảy ra lỗi khi lấy thông tin lịch trực',
                });
            }
        })();
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Ngày',
            dataIndex: 'date',
            key: 'date',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Ca làm việc',
            dataIndex: 'shift',
            key: 'shift',
        },
        {
            title: 'Bác sĩ',
            dataIndex: 'doctor_name',
            key: 'doctor_name',
        },
        {
            title: 'Phòng ban',
            dataIndex: 'department_name',
            key: 'department_name',
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'start_time',
            key: 'start_time',
            render: (text) => moment(text, 'HH:mm').format('HH:mm'),
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'end_time',
            key: 'end_time',
            render: (text) => moment(text, 'HH:mm').format('HH:mm'),
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Hành động',
            key: 'Hành động',
            render: (text, record) => (
                <Space size="small">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEditSchedule(record.id)}
                        style={{ width: 170, borderRadius: 15, height: 30 }}
                    >
                        Chỉnh sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa lịch trực này?"
                        onConfirm={() => handleDeleteSchedule(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            style={{ width: 170, borderRadius: 15, height: 30 }}
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    const [category, setCategory] = useState([]);
    const [fieldTypes, setFieldTypes] = useState([]);

    useEffect(() => {
        (async () => {
            try {

                const res = await scheduleAPI.getAllSchedules();
                setSchedules(res);
                console.log(schedules)

                const response = await userApi.getProfile();
                console.log(response);
                setUserData(response.user);

                const fieldTypesResponse = await fieldTypesApi.getAllFieldTypes();
                setFieldTypes(fieldTypesResponse);

                await courtsManagementApi.getAllCourts().then((res) => {
                    console.log(res);
                    setCategory(res);
                    setLoading(false);
                });
            } catch (error) {
                console.log('Failed to fetch category list:' + error);
            }
        })();
    }, []);

    const handleChange = (content) => {
        console.log(content);
        setDescription(content);
    }

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
                                <ScheduleOutlined />
                                <span>Quản lý lịch trực</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <PageHeader
                            subTitle=""
                            style={{ fontSize: 14 }}
                            extra={[
                                <Button
                                    key="1"
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={showModal}
                                >
                                    Tạo mới lịch trực
                                </Button>,
                            ]}
                        />

                        <div style={{ marginTop: 30 }}>
                            <Table scroll={{ x: true }}
                                columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={schedules} />
                        </div>

                        <Modal
                            title="Tạo mới lịch trực"
                            visible={openModalCreate}
                            onOk={form.submit}
                            onCancel={() => handleCancel("create")}
                            confirmLoading={loading}
                            destroyOnClose
                        >
                            <Form
                                form={form}
                                onFinish={handleOkSchedule}
                                layout="vertical"
                                initialValues={{ status: "active" }}
                            >
                                <Form.Item
                                    name="date"
                                    label="Ngày"
                                    style={{ marginBottom: 10 }}
                                    rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
                                >
                                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                                </Form.Item>
                                <Form.Item
                                    name="shift"
                                    label="Ca làm việc"
                                    style={{ marginBottom: 10 }}
                                    rules={[{ required: true, message: "Vui lòng chọn ca làm việc" }]}
                                >
                                    <Select style={{ width: "100%" }}>
                                        <Option value="morning">Ca sáng</Option>
                                        <Option value="afternoon">Ca chiều</Option>
                                        <Option value="evening">Ca tối</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="doctor_id"
                                    label="Bác sĩ"
                                    style={{ marginBottom: 10 }}
                                    rules={[{ required: true, message: "Vui lòng chọn bác sĩ" }]}
                                >
                                    <Select placeholder="Chọn bác sĩ">
                                        {category.map((item) => (
                                            <Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="department_id"
                                    label="Phòng ban"
                                    style={{ marginBottom: 10 }}
                                    rules={[{ required: true, message: "Vui lòng chọn phòng ban" }]}
                                >
                                    <Select placeholder="Chọn phòng ban">
                                        {fieldTypes.map((item) => (
                                            <Option key={item.id} value={item.id}>
                                                {item.type}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="start_time"
                                    label="Thời gian bắt đầu"
                                    style={{ marginBottom: 10 }}
                                    rules={[{ required: true, message: "Vui lòng chọn thời gian bắt đầu" }]}
                                >
                                    <TimePicker format="HH:mm" style={{ width: "100%" }} />
                                </Form.Item>
                                <Form.Item
                                    name="end_time"
                                    label="Thời gian kết thúc"
                                    style={{ marginBottom: 10 }}
                                    rules={[{ required: true, message: "Vui lòng chọn thời gian kết thúc" }]}
                                >
                                    <TimePicker format="HH:mm" style={{ width: "100%" }} />
                                </Form.Item>
                                <Form.Item
                                    name="description"
                                    label="Mô tả"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập mô tả!',
                                        },
                                    ]}
                                    style={{ marginBottom: 10 }}
                                >

                                    <SunEditor
                                        lang="en"
                                        placeholder="Content"
                                        onChange={handleChange}
                                        setContents={description}
                                        setOptions={{
                                            buttonList: [
                                                ["undo", "redo"],
                                                ["font", "fontSize"],
                                                // ['paragraphStyle', 'blockquote'],
                                                [
                                                    "bold",
                                                    "underline",
                                                    "italic",
                                                    "strike",
                                                    "subscript",
                                                    "superscript"
                                                ],
                                                ["fontColor", "hiliteColor"],
                                                ["align", "list", "lineHeight"],
                                                ["outdent", "indent"],

                                                ["table", "horizontalRule", "link", "image", "video"],
                                                // ['math'] //You must add the 'katex' library at options to use the 'math' plugin.
                                                // ['imageGallery'], // You must add the "imageGalleryUrl".
                                                // ["fullScreen", "showBlocks", "codeView"],
                                                ["preview", "print"],
                                                ["removeFormat"]

                                                // ['save', 'template'],
                                                // '/', Line break
                                            ],
                                            fontSize: [
                                                8, 10, 14, 18, 24,
                                            ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                                            defaultTag: "div",
                                            minHeight: "300px",
                                            showPathLabel: false,
                                            attributesWhitelist: {
                                                all: "style",
                                                table: "cellpadding|width|cellspacing|height|style",
                                                tr: "valign|style",
                                                td: "styleinsert|height|style",
                                                img: "title|alt|src|style"
                                            }
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="status"
                                    label="Trạng thái"
                                    style={{ marginBottom: 10 }}
                                    rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                                >
                                    <Select>
                                        <Option value="active">Hoạt động</Option>
                                        <Option value="inactive">Không hoạt động</Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                        </Modal>

                        <Modal
                            title="Cập nhật lịch trực"
                            visible={openModalUpdate}
                            onOk={form2.submit}
                            onCancel={() => handleCancel("update")}
                            confirmLoading={loading}
                            destroyOnClose
                        >
                            <Form
                                form={form2}
                                onFinish={handleUpdateSchedule}
                                layout="vertical"
                                initialValues={{ status: "active" }}
                            >
                                <Form.Item
                                    name="date"
                                    label="Ngày"
                                    style={{ marginBottom: 10 }}
                                    rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
                                >
                                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                                </Form.Item>
                                <Form.Item
                                    name="shift"
                                    label="Ca làm việc"
                                    style={{ marginBottom: 10 }}
                                    rules={[{ required: true, message: "Vui lòng chọn ca làm việc" }]}
                                >
                                    <Select style={{ width: "100%" }}>
                                        <Option value="morning">Ca sáng</Option>
                                        <Option value="afternoon">Ca chiều</Option>
                                        <Option value="evening">Ca tối</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="doctor_id"
                                    label="Bác sĩ"
                                    style={{ marginBottom: 10 }}
                                    rules={[{ required: true, message: "Vui lòng chọn bác sĩ" }]}
                                >
                                    <Select placeholder="Chọn bác sĩ">
                                        {category.map((item) => (
                                            <Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="department_id"
                                    label="Phòng ban"
                                    style={{ marginBottom: 10 }}
                                    rules={[{ required: true, message: "Vui lòng chọn phòng ban" }]}
                                >
                                    <Select placeholder="Chọn phòng ban">
                                        {fieldTypes.map((item) => (
                                            <Option key={item.id} value={item.id}>
                                                {item.type}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="start_time"
                                    label="Thời gian bắt đầu"
                                    style={{ marginBottom: 10 }}
                                    rules={[{ required: true, message: "Vui lòng chọn thời gian bắt đầu" }]}
                                >
                                    <TimePicker format="HH:mm" style={{ width: "100%" }} />
                                </Form.Item>
                                <Form.Item
                                    name="end_time"
                                    label="Thời gian kết thúc"
                                    style={{ marginBottom: 10 }}
                                    rules={[{ required: true, message: "Vui lòng chọn thời gian kết thúc" }]}
                                >
                                    <TimePicker format="HH:mm" style={{ width: "100%" }} />
                                </Form.Item>
                                <Form.Item name="note" label="Ghi chú" rules={[{ required: true, message: "Vui lòng ghi chú" }]}>
                                    <Input.TextArea rows={4}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="status"
                                    label="Trạng thái"
                                    style={{ marginBottom: 10 }}
                                    rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                                >
                                    <Select>
                                        <Option value="active">Hoạt động</Option>
                                        <Option value="inactive">Không hoạt động</Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                </div>
            </Spin>
            <BackTop />
        </div>
    );
};

export default ScheduleManagement;

