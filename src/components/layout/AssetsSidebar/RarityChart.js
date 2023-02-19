import { Box, Button, capitalize, CircularProgress } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import RarityTable from './RarityTable';
import moment from 'moment';

const RarityChart = ({
  collectionName,
  collectionId,
  policyId,
  traits,
  handleTraitFilter,
}) => {
  const [rarityTable, setRarityTable] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (policyId) {
      getRarityTable();
    }
  }, [policyId]);

  const getRarityTable = async () => {
    setLoading(true);
    // const traitsData = await axios
    //   .get(`https://publicapi.cnftpredator.tools/owners/${policyId}`)
    //   // .then((res) => res.data?.owners || [])
    //   .then((res) => ({
    //     traits: {
    //       hat: { black: 'https://picsum.photos/200/300/?random' },
    //       back: { red: 'https://picsum.photos/200/300/?random' },
    //       eyes: { pink: 'https://picsum.photos/200/300/?random' },
    //     },
    //   }))
    //   .then((res) => res.map((o) => ({ ...o, value: 1 })))
    //   .catch((err) => {
    //     console.log(err);
    //     setLoading(false);
    //     return [];
    //   });
    // const traitsData = {};

    setRarityTable(traits);
    return setLoading(false);
  };

  const memoizedRarityTable = rarityTable;
  // const memoizedRarityTable = useMemo(() => {
  //   return rarityTable;
  // }, [policyId, traits]);

  const exportRarityTablePDF = () => {
    const unit = 'pt';
    const size = 'A4'; // Use A1, A2, A3 or A4
    const orientation = 'portrait'; // portrait or landscape

    const doc = new jsPDF(orientation, unit, size);
    const tableTitle = `${collectionName} Rarity Chart`;

    doc.setFontSize(15);
    doc.text(tableTitle, 40, 40);

    const base64logo =
      'data:image/png;base64,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';

    Object.entries(memoizedRarityTable).map(([traitKey, traitValue], i) => {
      const tableOptions = {
        theme: 'striped',
        headStyles: { fontSize: 10, textColor: 'black' },
        bodyStyles: { fontSize: 10, fontStyle: 'italic' },
        alternateRowStyles: { fillColor: [255, 255, 255] },
        head: [['#', capitalize(traitKey), 'Chance']],
        body: Object.entries(traitValue)
          .sort((a, b) => a[1] - b[1])
          .map(([traitOptionKey, traitOptionValue], i) => [
            (i + 1).toString(),
            capitalize(traitOptionKey),
            (
              (traitOptionValue /
                Object.values(traitValue).reduce((a, b) => a + b)) *
              100
            ).toFixed(2) + '%',
          ]),
        startY: (doc.lastAutoTable.finalY || 50) + (i > 0 ? 50 : 0),
        styles: { fillColor: [251, 185, 250] },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: '90%' },
          2: { cellWidth: 50 },
        },
      };

      doc.autoTable(tableOptions);
    });

    for (
      let pageNumber = 1;
      pageNumber <= doc.getNumberOfPages();
      pageNumber++
    ) {
      doc.setPage(pageNumber);
      doc.addImage(base64logo, 'png', 475, 5);
      doc.setTextColor(150);
      doc.text(45, doc.internal.pageSize.height - 30, 'Made by cnftjungle.io');
      doc.text(
        doc.internal.pageSize.width - 220,
        doc.internal.pageSize.height - 30,
        moment().format('MMMM Do YYYY, HH:mm:ss')
      );
    }

    doc.save(`${tableTitle} by CNFT Jungle.pdf`);
  };

  if (loading) {
    return (
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <CircularProgress
          size={20}
          thickness={5}
          sx={{ color: 'var(--primaryColor)', ml: 1 }}
        />
      </Box>
    );
  }

  if (Object.keys(memoizedRarityTable).length === 0) {
    return (
      <Box style={{ textAlign: 'center' }}>
        <span>No rarity chart available.</span>
      </Box>
    );
  }

  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <RarityTable
        rarityTable={memoizedRarityTable}
        handleTraitFilter={handleTraitFilter}
        collectionId={collectionId}
      />
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          onClick={exportRarityTablePDF}
          variant="contained"
          style={{ borderRadius: 8, fontSize: 12, marginTop: 15 }}
        >
          Export Rarity Chart PDF
        </Button>
      </Box>
    </Box>
  );
};

export default RarityChart;
