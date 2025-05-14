import React, { useState, useEffect } from "react";
import { Table, Button, Card, Form, Row, Col } from "react-bootstrap";
import UserModal from "./UserModal";
import { useUserStore } from "../../store/UserStore";
import { Eye, Pencil, Trash } from "lucide-react";

const Users = () => {
  const { users, fetchUsers, deleteUser, loading } = useUserStore();
  const [modalState, setModalState] = useState({
    show: false,
    isEditMode: false,
    viewMode: false,
    selectedUser: null,
  });

  // Add filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users based on search query and filters
  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);

    const matchesRole =
      roleFilter === "all" || user.role.toLowerCase() === roleFilter;

    const matchesVerified =
      verifiedFilter === "all" ||
      (verifiedFilter === "verified" && user.isVerified) ||
      (verifiedFilter === "unverified" && !user.isVerified);

    return matchesSearch && matchesRole && matchesVerified;
  });

  const handleAdd = () => {
    setModalState({
      show: true,
      isEditMode: false,
      viewMode: false,
      selectedUser: null,
    });
  };

  const handleEdit = (user) => {
    setModalState({
      show: true,
      isEditMode: true,
      viewMode: false,
      selectedUser: user,
    });
  };

  const handleView = (user) => {
    setModalState({
      show: true,
      isEditMode: false,
      viewMode: true,
      selectedUser: user,
    });
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(users);
  return (
    <Card>
      <Card.Header>
        <Card.Title>Users Management</Card.Title>
        <Button variant="primary" onClick={handleAdd}>
          Add New User
        </Button>
      </Card.Header>
      <Card.Body>
        {/* Add filter controls */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search by name, email or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
                <option value="employee">Employee</option>
                <option value="client">Client</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Select
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
              >
                <option value="all">All Verification Status</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Table responsive striped>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers &&
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.phone}</td>
                  <td>{user.isVerified ? "Yes" : "No"}</td>
                  <td className="row row-cols-4">
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleView(user)}
                    >
                      <Eye size={15} />
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(user)}
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(user._id)}
                    >
                      <Trash size={15} />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Card.Body>
      <UserModal modalState={modalState} setModalState={setModalState} />
    </Card>
  );
};

export default Users;
