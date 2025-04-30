import { useQuery } from '@tanstack/react-query';
import { OrderService } from '@/src/assets/styles/services/order.service';
import { convertPrice } from '@/src/utils/convertPrice';
import Meta from '@/src/components/ui/Meta';
import Layout from '@/src/components/ui/layout/Layout';
import Heading from '@/src/components/ui/button/Heading';

const MyOrders = () => {
  const { data: orders } = useQuery({
    queryKey: ['my orders'],
    queryFn: () => OrderService.getAll(),
    select: (response) => response.data,
  });

  return (
    <Meta title="My Orders">
      <Layout>
        <Heading>My Orders</Heading>
        <section>
          <div className="max-h-[700px] overflow-y-auto pr-2">
            {orders?.length ? (
              orders.map((order: any) => (
                <div
                  key={order.order_id}
                  className="bg-while shadow flex flex-col sm:flex-row sm:gap-10 gap-2 p-7 my-7 font-semibold rounded-xl"
                >
                  <span className="block">#{order.order_id}</span>
                  <span className="block">Status: {order.status}</span>
                  <span className="block">
                    Date: {new Date(order.created_at).toLocaleDateString()}
                  </span>
                  <span className="block">
                    Total: {convertPrice(Number(order.total_amount))}
                  </span>
                </div>
              ))
            ) : (
              <div>Orders not found!</div>
            )}
          </div>
        </section>
      </Layout>
    </Meta>
  );
};

export default MyOrders;
