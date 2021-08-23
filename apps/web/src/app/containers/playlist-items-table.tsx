import { Avatar, Flex, Table, Text, Button } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useTable, Column } from 'react-table';
import styled from 'styled-components';
import { Icons } from '../components';

const TableText = styled.p`
  text-overflow: ellipsis;
  max-width: 25rem;
  white-space: nowrap;
  overflow: hidden;
  min-width: 30px;
`;

const TableStyles = styled.div`
  padding: 1rem;

  table {
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      color: grey;
      font-weight: normal;
    }
  }
`;

export type PlaylistItemDataType = {
  id: string;
  title: string;
  description: string;
  time: string;
  thumbnail_url: string;
};

type PlaylistItemsTableContainerType = {
  data: PlaylistItemDataType[];
};

const PlaylistItemsTableContainer: React.FC<PlaylistItemsTableContainerType> =
  ({ data }) => {
    const columns = useMemo<Column<PlaylistItemDataType>[]>(
      () => [
        {
          Header: '#',
          accessor: () => {
            return (
              <Button>
                <Icons.CirclePlay size="lg" className="text-red-400" />
              </Button>
            );
          },
        },
        {
          Header: 'Title',
          accessor: (row) => {
            return (
              <Flex alignItems="center" className="gap-1">
                <Avatar src={row.thumbnail_url} />
                <Text>{row.title}</Text>
              </Flex>
            );
          },
        },
        {
          Header: 'Description',
          accessor: 'description',
        },
        {
          Header: 'More',
          accessor: 'time',
        },
      ],
      []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
      useTable({
        columns,
        data,
      });

    return (
      <TableStyles>
        <Table {...getTableProps()} variant="simple" textAlign="center">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>
                        <TableText>{cell.render('Cell')}</TableText>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableStyles>
    );
  };

export default PlaylistItemsTableContainer;
