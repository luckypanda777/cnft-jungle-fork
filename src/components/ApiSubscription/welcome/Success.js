import { createPortalSession } from 'apiProvider';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Context as FeedbackContext } from 'context/FeedbackContext';

const Success = ({ sessionId }) => {
  const router = useRouter();
  const { showFeedback } = useContext(FeedbackContext);

  const handleCreatePortalSession = async () => {
    try {
      const { portalSession } = await createPortalSession({ sessionId });
      router.push(portalSession.url);
    } catch (err) {
      console.log(err);
      showFeedback({
        message: 'Something went wrong. Please try again.',
        kind: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <section>
      <div className="product Box-root">
        <div className="description Box-root">
          <h3>Subscription to starter plan successful!</h3>
        </div>
      </div>

      <button
        id="checkout-and-portal-button"
        onClick={handleCreatePortalSession}
      >
        Manage your billing information
      </button>
    </section>
  );
};

export default Success;
