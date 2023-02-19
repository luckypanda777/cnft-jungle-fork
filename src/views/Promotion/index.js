import {
  Container,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Link,
} from '@mui/material';
import styles from './styles.module.scss';
import { useContext, useState, useEffect, useRef } from 'react';
import Card from 'components/cards/CollectionCard';
import Supporter from 'components/layout/Supporter';
import Input from 'components/common/Input';
import Select from 'components/common/Select';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Context as FeedbackContext } from '../../context/FeedbackContext';
import { sendPromo } from '../../apiProvider';
import moment from 'moment';
import Calendar from './Calendar';
import { handleSendAda } from 'utils/purchaseNFT';
import { FileUploader } from 'react-drag-drop-files';
import WalletPopover from '../../components/common/WalletPopover';
import { useAppContext } from '../../context/AppContext';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import gem_example from 'assets/gem_example.png';
import featured_example from 'assets/featured_example.png';
import { WalletButtonBase } from 'components/buttons/WalletButton/WalletButton';

const StyledButton = styled(Button)(({ theme }) => ({
  fontFamily: 'newgilroybold',
  textTransform: 'uppercase',
  padding: '12px',
  width: '100%',
  borderRadius: '10px',
  boxShadow: '0px 4px 15px 0px rgba(94, 111, 239, 0.5)',
  color: '#fff',
  fontSize: '14px',
  letterSpacing: '1.68px',
  minWidth: '200px',
}));

const FormError = ({ msg }) => <span className={styles.formError}>{msg}</span>;

const SubmitButton = ({ walletInfo, handleSave, paymentLoading }) => {
  const [openedPopover, setOpenedPopover] = useState(false);
  const anchor = useRef(null);

  const handlePopoverOpen = () => {
    setOpenedPopover(true);
  };

  const handlePopoverClose = () => {
    setOpenedPopover(false);
  };

  return (
    <>
      <WalletButtonBase
        sx={{ height: 45, color: 'var(--textDefaultcolor)' }}
        onClick={handleSave}
        ref={anchor}
        disabled={walletInfo.loading || paymentLoading}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {walletInfo.loading || paymentLoading ? (
          <CircularProgress
            size={15}
            style={{ color: 'var(--textDefaultcolor)' }}
          />
        ) : (
          'Pay & Submit'
        )}
      </WalletButtonBase>
      {!walletInfo.name && (
        <WalletPopover
          anchor={anchor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={openedPopover}
          handleClose={handlePopoverClose}
          handleOpen={handlePopoverOpen}
        />
      )}
    </>
  );
};

const formInitialState = {
  name: 'Collection Name',
  description:
    'A sample of an engaging and cool description for your collection.',
  email: '',
  policyId: null,
  image: null,
  socials: {
    twitter: '',
    website: '',
    discord: '',
  },
  from: moment(),
  to: moment().add(3, 'd'),
  link: 'https://www.cnftjungle.io/',
  type: 'featured',
  promotion: 'Promotion text',
};

export const getDiff = (start, end) => {
  return moment(start).startOf('day').diff(moment(end).startOf('day'), 'days');
};

const AVAILABLE_GEM_SPOT_DATE = [
  { from: moment(), to: moment().add(3, 'd') },
  { from: moment(), to: moment().add(7, 'd') },
  { from: moment(), to: moment().add(14, 'd') },
  { from: moment(), to: moment().add(31, 'd') },
];
const AVAILABLE_FEATURED_DATE = [
  { from: moment().add(3, 'd'), to: moment().add(6, 'd') },
  { from: moment().add(3, 'd'), to: moment().add(10, 'd') },
  { from: moment().add(3, 'd'), to: moment().add(17, 'd') },
  { from: moment().add(3, 'd'), to: moment().add(34, 'd') },
];

const mapDates = (dates) => {
  return [{ value: '', label: 'None', disabled: true }].concat(
    dates.map((date) => {
      const value = `${date.from.valueOf()}-${date.to.valueOf()}`;
      const label = `${date.from.format('MMM Do')} - ${date.to.format(
        'MMM Do'
      )}`;

      return { label, value };
    })
  );
};

function Promotion() {
  const [form, setForm] = useState(formInitialState);
  const [errors, setErrors] = useState({});
  const { showFeedback } = useContext(FeedbackContext);
  const {
    state: { walletInfo, isMobile },
  } = useAppContext();
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [dateRange, setDateRange] = useState('');
  const [available, setAvailable] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handleFormType = (e) => {
    setForm((prev) => ({ ...prev, type: e.target.value }));
  };

  const validationSocials = (name, value) => {
    if (value.length > 0 && !/^(http|https):\/\/[^ "]+$/.test(value)) {
      setErrors((prev) => ({ ...prev, [name]: true }));
    } else {
      setErrors((prev) => {
        const temp = { ...prev };
        delete temp[name];
        return temp;
      });
    }
  };

  const handleFormText = (e, socials = false) => {
    if (socials) {
      validationSocials(e.target.name, e.target.value);
      setForm((prev) => ({
        ...prev,
        socials: { ...prev.socials, [e.target.name]: e.target.value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleDateChange = (date, field) => {
    const diff =
      field === 'from' ? getDiff(form.to, date) : getDiff(date, form.from);

    if (diff < 0) {
      return showFeedback({
        message: `You cannot set negative date`,
        kind: 'error',
        duration: 5000,
      });
    }

    setDateRange('');
    setAvailable(null);

    setForm((prev) => ({ ...prev, [field]: moment(date) }));
  };

  const handleDateSelect = (e) => {
    setAvailable(e.target.value);
    setDateRange(e.target.value);
  };

  const cardImg = form.image ? URL.createObjectURL(form.image) : form.image;
  const daysDiff = getDiff(form.to, form.from) + 1;
  const price =
    (form.type === 'featured' ? 200 : 60) *
    (form.from && form.to ? (daysDiff === 0 ? 1 : daysDiff) : 1);

  const handleSave = async () => {
    if (!walletInfo.name) return;
    if (Object.keys(errors).length) return;

    if (!form.email) {
      return showFeedback({
        message: `Please fill the email field`,
        kind: 'error',
        duration: 5000,
      });
    }

    if (!form.image) {
      return showFeedback({
        message: `Please select an image!`,
        kind: 'error',
        duration: 5000,
      });
    }

    if (form.type === 'featured') {
      if (!form.name.length || !form.description.length) {
        return showFeedback({
          message: `Please fill name, description`,
          kind: 'error',
          duration: 5000,
        });
      }
    } else {
      if (!form.link.length || !form.description.length) {
        return showFeedback({
          message: `Please fill link, description`,
          kind: 'error',
          duration: 5000,
        });
      }
    }

    const data =
      form.type === 'featured'
        ? {
            ...form,
            from: moment(form.from).format('x'),
            to: moment(form.to).format('x'),
            socials: JSON.stringify(form.socials),
          }
        : {
            link: form.link,
            description: form.description,
            image: form.image,
            email: form.email,
            from: moment(form.from).format('x'),
            to: moment(form.to).format('x'),
            type: form.type,
          };

    setPaymentLoading(true);
    const txHash = await handleSendAda({ amount: price });

    if (txHash) {
      return sendPromo({ ...data, txHash })
        .then(() => {
          showFeedback({
            message: `Promotion request successfully sent for review`,
            kind: 'success',
            duration: 5000,
          });
          setForm(formInitialState);
        })
        .finally(() => setPaymentLoading(false));
    } else {
      setPaymentLoading(false);
      return showFeedback({
        message: `Payment failed. Please try again or contact support`,
        kind: 'error',
        duration: 5000,
      });
    }
  };

  const handleDrop = (file) => {
    if (!file) return;

    if (file.size > 1000000) {
      return showFeedback({
        message:
          'File should be below 1mb in size. If possible use the webp format with 400x400px resolution',
        kind: 'error',
        duration: 3000,
      });
    }

    setForm((prev) => ({ ...prev, image: file }));
  };

  useEffect(() => {
    if (available) {
      const [from, to] = available.split('-');

      setForm((prev) => ({
        ...prev,
        from: moment(Number(from)),
        to: moment(Number(to)),
      }));
    }
  }, [available]);

  return (
    <Container maxWidth="xl">
      <Box sx={{ textAlign: 'center', marginTop: 5 }}>
        <h1>Let the whole Jungle know about you</h1>
        <h4
          style={{
            maxWidth: 500,
            wordBreak: 'break-word',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          To just add an upcoming collection please use our{' '}
          <Link href="/calendar">Calendar</Link> instead. Choose from a “gem”
          button that is visible at the top of every page or upgrade to a
          “featured” listing and display your project on main Jungle pages.
        </h4>
      </Box>
      <Box className="flex direction-column justify-center align-center">
        {/* <div className={styles.examples}>
          <Box className={styles.exampleBox}>
            <div className={styles.exampleImgBox}>
              <img
                crossOrigin="anonymous"
                alt="gem example"
                src={gem_example.src}
              />
            </div>
            <h3 className={styles.exampleTitle}>Jungle GEM</h3>
            <p className={styles.exampleDescription}>
              Visible at the top of every page
            </p>
          </Box>
          <Box className={styles.exampleBox}>
            <div className={styles.exampleImgBox}>
              <img
                crossOrigin="anonymous"
                alt="featured example"
                src={featured_example.src}
              />
            </div>
            <h3 className={styles.exampleTitle}>Featured listing</h3>
            <p className={styles.exampleDescription}>
              Display your project on all the main Jungle pages
            </p>
          </Box>
        </div> */}
        <Box>
          <FormControl>
            <h3 style={{ textAlign: 'center' }}>Select type</h3>
            <RadioGroup
              row
              name="advert-radio"
              value={form.type}
              onChange={handleFormType}
            >
              <FormControlLabel
                value="featured"
                control={<Radio />}
                label={
                  <span style={{ fontFamily: 'newgilroybold' }}>
                    Web and Mobile Promoted (200 ADA/day)
                  </span>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <h3 style={{ textAlign: 'center' }}>Select a free slot</h3>
        <Select
          style={{ width: 200 }}
          placeholder="Choose a slot"
          value={dateRange}
          options={
            form.type === 'featured'
              ? mapDates(AVAILABLE_FEATURED_DATE)
              : mapDates(AVAILABLE_GEM_SPOT_DATE)
          }
          onChange={handleDateSelect}
        />
        <h3 style={{ marginBottom: 5 }}>Or propose your time*</h3>
        <h5 style={{ marginTop: 0, textAlign: 'center' }}>
          *In case of full booking the payment will be refunded, please refer to
          our calendar below or contact us in case of questions about
          availability
        </h5>
        <Box
          className="flex direction-row f-1"
          sx={{ columnGap: '8px', alignItems: 'center' }}
        >
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              style={{ width: 200 }}
              open={fromOpen}
              label="From"
              disablePast
              value={form.from}
              onChange={(val) => handleDateChange(val, 'from')}
              onClose={() => setFromOpen(false)}
              renderInput={(params) => (
                <Input onClick={() => setFromOpen(true)} {...params} />
              )}
              closeOnSelect
              ampm={false}
            />
            <span>-</span>
            <DatePicker
              style={{ width: 200 }}
              open={toOpen}
              label="To"
              disablePast
              value={form.to}
              onClose={() => setToOpen(false)}
              onChange={(val) => handleDateChange(val, 'to')}
              renderInput={(params) => (
                <Input onClick={() => setToOpen(true)} {...params} />
              )}
              closeOnSelect
            />
          </LocalizationProvider>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          my: 1.5,
        }}
      >
        <h3 style={{ textAlign: 'center' }}>Preview</h3>
        <Box className="flex align-center" sx={{ minHeight: '205px' }}>
          {form.type === 'featured' ? (
            <Card
              collection_name={form.name}
              description={form.description}
              image={cardImg}
              addedAt={form.from}
              socials={
                errors.website || errors.discord || errors.twitter
                  ? undefined
                  : form.socials
              }
              isAdding
              featured
              promotionText={form.promotion}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'var(--outOfStockBg)',
                borderRadius: 1,
              }}
            >
              <Supporter
                image={cardImg}
                title={form.description}
                link={form.link}
                containerStyle={{
                  width: 40,
                  height: 40,
                  margin: 0,
                  padding: 2,
                  justifyContent: 'center',
                }}
                gemStyle={{
                  margin: 0,
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
      <Box className="flex direction-column">
        <h3 style={{ textAlign: 'center', marginBottom: 30 }}>
          Project details
        </h3>

        <Box className="flex direction-column f-1" sx={{ rowGap: '8px' }}>
          <Box className="flex direction-row f-1" sx={{ columnGap: '8px' }}>
            <Box className="flex direction-column f-1" sx={{ rowGap: '8px' }}>
              {form.type === 'featured' && (
                <Input
                  placeholder="Collection Name"
                  name="name"
                  onChange={handleFormText}
                  inputProps={{ maxLength: 40 }}
                />
              )}
            </Box>
            <Box className="flex direction-column f-1" sx={{ rowGap: '8px' }}>
              {form.type === 'featured' && (
                <Input
                  placeholder="Policy ID"
                  name="policyId"
                  onChange={handleFormText}
                />
              )}
            </Box>
          </Box>
          <Box className="flex direction-row" sx={{ columnGap: '8px' }}>
            <Box
              className="flex direction-column f-1"
              sx={{ rowGap: form.type === 'gem' ? '8px' : 0 }}
            >
              <Input
                placeholder="Description"
                name="description"
                onChange={handleFormText}
                multiline
                rows={form.type === 'featured' ? 6 : 3}
                inputProps={{ maxLength: 110 }}
              />
              {form.type === 'gem' && (
                <Input
                  placeholder="Link"
                  name="link"
                  onChange={handleFormText}
                />
              )}
            </Box>
            <Box className="f-1">
              <FileUploader
                handleChange={handleDrop}
                name="file"
                types={['JPG', 'PNG', 'GIF', 'WEBP', 'JPEG']}
              >
                <div
                  className={`flex direction-row align-center justify-center ${styles.uploadBtn}`}
                >
                  <AddPhotoAlternateIcon fontSize="large" sx={{ mr: '8px' }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <span>Upload image</span>
                    <span style={{ fontSize: 12 }}>
                      Allowed: png, jpg, gif, webp
                    </span>
                    <span style={{ fontSize: 12 }}>Size limit: 1mb.</span>
                  </Box>
                </div>
              </FileUploader>
            </Box>
          </Box>
          {form.type === 'featured' && (
            <Box className="flex direction-row f-1" sx={{ columnGap: '8px' }}>
              <FormControl className="f-1">
                <Input
                  placeholder="Promotion text"
                  name="promotion"
                  onChange={(e) => handleFormText(e, false)}
                  inputProps={{ maxLength: 20 }}
                />
              </FormControl>
              <FormControl className="f-1">
                <Input
                  placeholder="Website"
                  name="website"
                  onChange={(e) => handleFormText(e, true)}
                  error={errors['website']}
                />
                {errors['website'] && (
                  <FormError msg="Incorrect website address" />
                )}
              </FormControl>
              <FormControl className="f-1">
                <Input
                  placeholder="Twitter"
                  name="twitter"
                  onChange={(e) => handleFormText(e, true)}
                  error={errors['twitter']}
                />
                {errors['twitter'] && (
                  <FormError msg="Incorrect twitter link" />
                )}
              </FormControl>
              <FormControl className="f-1">
                <Input
                  placeholder="Discord"
                  name="discord"
                  onChange={(e) => handleFormText(e, true)}
                  error={errors['discord']}
                />
                {errors['discord'] && (
                  <FormError msg="Incorrect discord link" />
                )}
              </FormControl>
            </Box>
          )}
        </Box>
        <h3 style={{ textAlign: 'center', marginTop: 30 }}>Contact details</h3>
        <Box sx={{ width: 300, mx: 'auto' }}>
          <Input
            placeholder="Contact Email"
            name="email"
            onChange={handleFormText}
          />
        </Box>
        <Box
          sx={{
            marginTop: 4,
            marginBottom: 1,
            display: 'flex',
            justifyContent: 'center',
            mx: 'auto',
            columnGap: 1,
          }}
        >
          <span style={{ fontSize: 24 }}>Total:</span>
          <span style={{ fontSize: 24 }}>{price} ADA</span>
        </Box>
        <Box
          sx={{
            margin: '16px 0',
            display: 'flex',
            justifyContent: 'center',
            mx: 'auto',
          }}
        >
          <SubmitButton
            walletInfo={walletInfo}
            handleSave={handleSave}
            paymentLoading={paymentLoading}
          />
        </Box>
        <Box sx={{ py: 5 }}>
          <Calendar type={form.type} />
        </Box>
      </Box>
    </Container>
  );
}

export default Promotion;
