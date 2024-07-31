"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import Pagination from '../../../Common/Pagination/Pagination';
import DeleteUserModal from '../DeleteUserModal/DeleteUserModal';
import AddUserModal from '../AddUserModal/AddUserModal';
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from 'axios';

const Users = () => {
  const user = useSession().data?.user || {};
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const rowsPerPage = 5;

  const role = searchParams.get('role');

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/users', { params: { role } });
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteClick = (id) => {
    setUserIdToDelete(id);
    setShowDeleteModal(true);
  };

  const paginatedData = data.filter(p => `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())).slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <>
      <div className="flex flex-col py-8 gap-8">
        <div className="flex justify-between">
          <div>
            <p className="text-4xl">{role === 'player' ? 'Players' : role === 'staff' ? 'Staff' : role === 'trainer' ? 'Trainers' : 'Invalid Role'} Database</p>
          </div>
          <div className="flex flex-row gap-4 w-2/5">
            <div className="search-bar flex-1">
              <input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-2 py-1 rounded-lg h-full text-white search-background focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div className={`${user.role !== 'admin' && 'hidden'}`}>
              <button className="bg-primary dark-blue-color rounded w-48 h-14 flex items-center justify-center text-lg font-bold" onClick={() => setShowAddModal(true)}>
                ADD NEW {role === 'player' ? 'PLAYER' : role === 'staff' ? 'STAFF' : role === 'trainer' ? 'TRAINER' : 'Invalid Role'}
              </button>
            </div>
          </div>
        </div>
        <div className="">
          <TableContainer component={Paper} className="!bg-transparent">
            <Table sx={{ minWidth: 1000, overflow: 'auto' }}>
              <TableHead className="leaderboard-table-head bg-primary-light uppercase">
                <TableRow>
                  <TableCell className="!text-white"></TableCell>
                  <TableCell className="!text-white">Name</TableCell>
                  <TableCell className="!text-white">Email</TableCell>
                  <TableCell className="!text-white">Date of Joining</TableCell>
                  <TableCell className="!text-white">Remaining Credits</TableCell>
                  <TableCell className="!text-white">Subscription Plan</TableCell>
                  {user.role === 'admin' && <TableCell className="!text-white">Delete {role === 'player' ? 'Player' : role === 'staff' ? 'Staff' : role === 'trainer' ? 'Trainer' : 'Invalid Role'}</TableCell>}
                  <TableCell className="!text-white">{user.role !== 'admin' && 'Action'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="leaderboard-table-body">
                {paginatedData.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell className="!text-white" sx={{ minWidth: 100 }}>
                      <img
                        src={row.imageUrl}
                        alt={row.firstName}
                        style={{ width: 54, height: 64 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="!text-white !text-lg !font-bold">
                        {row.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="!text-white !text-lg">
                        {row.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="!text-white !text-lg">
                        {row.date}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="!text-primary !text-xl">
                        {row.balance}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="!text-primary !text-xl">
                        {row.plan}
                      </Typography>
                    </TableCell>
                    {user.role === 'admin' &&
                      <TableCell className="!text-white">
                        <IconButton onClick={() => handleDeleteClick(row._id)}>
                          <img src="/assets/delete-icon.svg" />
                        </IconButton>
                      </TableCell>}
                    <TableCell className="!text-white" sx={{ minWidth: 75 }}>
                      <IconButton onClick={() => router.push(`/users/view?role=${role}&id=${row._id}`)}>
                        <img src="/assets/open.svg" width={22} height={22} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            page={page}
            count={Math.ceil(data.length / rowsPerPage)}
            onChange={handlePageChange}
          />
          <AddUserModal open={showAddModal} onClose={() => setShowAddModal(false)} role={role} onSuccess={fetchData} />
          <DeleteUserModal
            open={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            userId={userIdToDelete}
            onSuccess={fetchData}
          />
        </div>
      </div>
    </>
  );
};

export default Users;
