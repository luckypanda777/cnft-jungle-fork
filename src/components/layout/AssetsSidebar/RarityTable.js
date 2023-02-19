import React, { useState, useEffect, memo } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button, capitalize, Tooltip } from '@mui/material';
import { shorten } from 'utils/shorten';
import { AutoSizer, Table, Column } from 'react-virtualized';
import styles from './RarityChart.module.scss';
import { nFormatter } from 'utils/formatCurrency';
import { getCollectionTraitFloors } from 'apiProvider';
import { useRouter } from 'next/router';
import CustomTooltip from 'components/common/CustomTooltip';

class MuiVirtualizedTable extends React.PureComponent {
  constructor(props, ctx) {
    super(props, ctx);

    this.state = {
      rowHeight: 40,
      ...props,
    };

    this.renderLabel = this.renderLabel.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.renderValue = this.renderValue.bind(this);
  }

  renderLabel = ({ rowData }) => {
    const [traitOptionKey] = rowData;
    return (
      <TableCell sx={{ padding: '6px 8px', border: 'none' }}>
        <CustomTooltip title={capitalize(traitOptionKey)} placement="bottom">
          <span>{shorten(capitalize(traitOptionKey), 14)}</span>
        </CustomTooltip>
      </TableCell>
    );
  };

  renderValue = ({ columnData, cellData, rowData }) => {
    const [traitOptionKey, traitOptionValue, percent] = rowData;
    return (
      <TableCell align="right" sx={{ padding: '6px 8px', border: 'none' }}>
        {`${percent}%`}
      </TableCell>
    );
  };

  renderButton = ({ rowData }) => {
    const [traitOptionKey] = rowData;

    let traitFloor = 0;
    if (this.state.traitKey.includes('list_')) {
      const trait = this.state.collectionTraitFloors?.[this.state.traitKey];
      traitFloor =
        Object.entries(trait)
          .map(([key, value]) => ({ key, value }))
          .filter(({ key }) => key.includes(traitOptionKey))
          .sort((a, b) => a.value - b.value)?.[0]?.value || 0;
    } else {
      traitFloor =
        this.state.collectionTraitFloors?.[this.state.traitKey]?.[
          traitOptionKey
        ] || 0;
    }

    return (
      <TableCell align="right" sx={{ padding: '6px 8px', border: 'none' }}>
        <CustomTooltip
          title={`Click to filter by this trait`}
          placement="bottom"
        >
          <Button
            variant="contained"
            size="small"
            sx={{
              padding: '4px 6px',
              minWidth: '32px',
              fontSize: '10px',
            }}
            onClick={() => this.props.handleAction(traitOptionKey)}
          >
            {traitFloor ? `₳ ${nFormatter(traitFloor, 1)}` : 'Filter'}
          </Button>
        </CustomTooltip>
      </TableCell>
    );
  };

  render() {
    const { rowHeight, ...tableProps } = this.state;

    return (
      <AutoSizer disableHeight>
        {({ height, width }) => (
          <Table
            disableHeader={true}
            headerHeight={0}
            height={215}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: 'inherit',
            }}
            {...tableProps}
            //className={classes.table}
            rowClassName={styles.virtualizedRow}
          >
            <Column
              dataKey="label"
              cellRenderer={this.renderLabel}
              width={120}
            />
            <Column
              dataKey="value"
              cellRenderer={this.renderValue}
              width={80}
            />
            <Column
              dataKey="action"
              cellRenderer={this.renderButton}
              width={75}
            />
          </Table>
        )}
      </AutoSizer>
    );
  }
}

const sortTraits = (obj) => {
  return Object.entries(obj)
    .map(([traitOptionKey, traitOptionValue]) => {
      const percent = (
        (traitOptionValue / Object.values(obj).reduce((a, b) => a + b)) *
        100
      ).toFixed(2);
      return [traitOptionKey, traitOptionValue, percent];
    })
    .sort((a, b) => a[1] - b[1]);
};

function Row({
  traitKey,
  traitValue,
  collectionTraitFloors,
  handleTraitFilter,
}) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);

  const handleFilter = (traitOptionKey) => {
    handleTraitFilter(traitKey, traitOptionKey);
  };

  useEffect(() => {
    if (!data.length && open) {
      setData(sortTraits(traitValue));
    }
  }, [open]);

  return (
    <React.Fragment>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          ':hover': { opacity: 0.75, cursor: 'pointer' },
          '& > td': { padding: '12px 8px' },
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell>
          <IconButton aria-label="expand row" size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell scope="row">
          {capitalize(traitKey).replace('Attributes / ', '')}
        </TableCell>
        <TableCell scope="row">{Object.keys(traitValue).length}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {data.length && (
                <MuiVirtualizedTable
                  traitKey={traitKey}
                  rowCount={Object.entries(traitValue).length}
                  rowGetter={({ index }) => data[index]}
                  handleAction={handleFilter}
                  collectionTraitFloors={collectionTraitFloors}
                />
              )}
              {/*<Table size="small" aria-label="purchases">
                <TableBody>
                  {Object.entries(traitValue)
                    .sort((a, b) => a[1] - b[1])
                    .map(([traitOptionKey, traitOptionValue], i) => (
                      <TableRow
                        key={i}
                        sx={{
                          '& > td': { padding: '6px 8px' },
                        }}
                      >
                        <CustomTooltip
                          title={capitalize(traitOptionKey)}
                          placement="bottom"
                        >
                          <TableCell>
                            {shorten(capitalize(traitOptionKey), 14)}
                          </TableCell>
                        </CustomTooltip>
                        <TableCell align="right">
                          {(
                            (traitOptionValue /
                              Object.values(traitValue).reduce(
                                (a, b) => a + b
                              )) *
                            100
                          ).toFixed(2)}
                          %
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          <CustomTooltip
                            title={`Click to filter by this trait`}
                            placement="bottom"
                          >
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                padding: '4px 6px',
                                minWidth: '32px',
                                fontSize: '10px',
                              }}
                              onClick={() => handleFilter(traitOptionKey)}
                            >
                              Filter
                            </Button>
                          </CustomTooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>*/}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const RarityTable = ({ rarityTable, handleTraitFilter, collectionId }) => {
  const router = useRouter();

  return (
    <TableContainer component={Paper}>
      <MuiTable aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell>Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(rarityTable).map(([traitKey, traitValue]) => {
            return (
              <Row
                key={traitKey}
                traitKey={traitKey}
                traitValue={traitValue}
                handleTraitFilter={handleTraitFilter}
                collectionTraitFloors={collectionTraitFloors}
              />
            );
          })}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default memo(RarityTable);
