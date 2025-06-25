import { GetServerSideProps } from 'next';
import Stripe from 'stripe';

type Props = { product: string; amount: number };

export default function Success({ product, amount }: Props) {
  return (
    <main style={{ textAlign:'center', padding:'2rem', fontFamily:'sans-serif' }}>
      <h1>Thank you!</h1>
      <p><strong>{product}</strong></p>
      <p>Amount: \</p>
      <p>Your charge will appear on your statement soon.</p>
      <p><a href="/">Send another flame</a></p>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });
  const session = await stripe.checkout.sessions.retrieve(query.session_id as string, {
    expand: ['line_items.data.price.product']
  });
  const item = session.line_items?.data[0];

  return {
    props: {
      product: ' unit_amount: $UnitAmountCents,',
      amount: session.amount_total ?? t_data: { name: '$ProductName' },,
    },
  };
};
