import IcStarLiked from 'assets/icons/ic-star-liked.svg';
import IcStar from 'assets/icons/ic-star.svg';
import IcChecked from 'assets/icons/ic-checked.svg';
import { PORTFOLIO_STATUS } from 'components/PortfolioV2/constants';
import styles from './Item.module.scss';

const Item = ({ data }) => {
  const { avatar, title, from, status, liked } = data;

  const renderStatus = () => {
    let backgroundColor, text, color;
    switch (status) {
      case PORTFOLIO_STATUS.BUY:
        backgroundColor = 'var(--buyStatusBgColor)';
        text = 'Buy';
        color = 'var(--buyStatusColor)';
        break;
      case PORTFOLIO_STATUS.SALE:
        backgroundColor = 'var(--saleStatusBgColor)';
        text = 'Sale';
        color = 'var(--saleStatusColor)';
        break;
      case PORTFOLIO_STATUS.MINT:
        backgroundColor = 'var(--mintStatusBgColor)';
        text = 'Mint';
        color = 'var(--mintStatusColor)';
        break;
      default:
        break;
    }

    return (
      <div style={{ backgroundColor }} className={styles.status}>
        <div style={{ color }} className={styles.textStatus}>
          {text}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        <img
          className={styles.avatar}
          src={avatar}
          alt="avatar"
          width={80}
          height={80}
        />
        <div className={styles.detailLeft}>
          <div className={styles.title}>{title}</div>
          <div className={styles.from}>From: 9t7x25mreert…</div>
          {renderStatus()}
        </div>
        <div className={styles.detailRight}>
          <div className={styles.buyPrice}>
            Buy Price: <span className={styles.price}>₳400.00</span>
          </div>
          <div className={styles.date}>
            Date: <span className={styles.time}>30/10/2022 19:28 UTC</span>
          </div>
          <div className={styles.hash}>
            <div className={styles.textHash}>TX Hash: tx05035…0950348517</div>
            <IcChecked width={15} height={16} />
          </div>
        </div>
      </div>
      <div className={styles.button}>
        <div className={styles.imageWrap}>
          {liked ? (
            <IcStarLiked width={35} height={35} />
          ) : (
            <IcStar width={35} height={35} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Item;
