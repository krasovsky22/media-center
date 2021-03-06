import { Avatar, Button, Flex, Table } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { Column, useTable } from 'react-table';
import styled from 'styled-components';
import { Icons } from '../components';
import { usePlayerPageStateState } from '../context/player-page';
import { YoutubePlaylistItem } from '../youtube-playlist';

const TableText = styled.p`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  min-width: 30px;
  max-width: 30vw;
`;

const TableStyles = styled.div`
  table {
    table-layout: auto;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      color: grey;
      font-weight: normal;
    }
  }
`;

export interface PlaylistItemDataType extends Partial<YoutubePlaylistItem> {
  id: string;
  title: string;
  description: string;
  owner: string;
  thumbnail_url: string;
  isFavorite: boolean;
}

type PlaylistItemsTableContainerType = {
  data: PlaylistItemDataType[];
};

const PlaylistItemsTableContainer: React.FC<PlaylistItemsTableContainerType> =
  ({ data }) => {
    const { activeVideoId, setActiveVideoId, addOrRemoveFavorite } =
      usePlayerPageStateState();

    const columns = useMemo<Column<PlaylistItemDataType>[]>(
      () => [
        {
          Header: '',
          id: 'isFavorite',
          accessor: (row) => {
            const { isFavorite } = row;
            return (
              <Button
                backgroundColor="transparent"
                onClick={() => addOrRemoveFavorite(row)}
              >
                {isFavorite ? (
                  <Icons.StarFilled className="text-yellow-400" />
                ) : (
                  <Icons.Star className="text-yellow-400" />
                )}
              </Button>
            );
          },
        },
        {
          Header: '',
          id: 'id',
          accessor: ({ id }) => {
            return (
              <Button
                backgroundColor="transparent"
                className="hover:bg-transparent"
                onClick={() =>
                  setActiveVideoId((prevActiveId) =>
                    prevActiveId === id ? null : id
                  )
                }
              >
                {activeVideoId === id ? (
                  <Icons.Pause size="lg" className="text-yellow-400" />
                ) : (
                  <Icons.CirclePlay size="lg" className="text-red-400" />
                )}
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
                <TableText>{row.title}</TableText>
              </Flex>
            );
          },
        },
        {
          Header: 'Description',
          accessor: (row) => {
            return <TableText>{row.description}</TableText>;
          },
        },
        {
          Header: 'Owner',
          accessor: 'owner',
        },
      ],
      [activeVideoId]
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
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
