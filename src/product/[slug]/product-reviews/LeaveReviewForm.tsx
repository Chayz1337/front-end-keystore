import { FC } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useMutation, useQueryClient, RefetchQueryFilters, QueryKey } from '@tanstack/react-query';
import { ReviewService } from '@/src/assets/styles/services/review.service';
import { IReviewFields } from './review-fields.interface';
import Button from '@/src/components/ui/button/Button';
import { Rating } from 'react-simple-star-rating';
import Loader from '@/src/components/ui/Loader';
import Heading from '@/src/components/ui/button/Heading';

const LeaveReviewForm: FC<{ productId: number }> = ({ productId }) => {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<IReviewFields>({
    mode: 'onChange'
  });

  const queryClient = useQueryClient();

  const { mutate, isSuccess, isPending } = useMutation({
    mutationKey: ['leave review'],
    mutationFn: (data: IReviewFields) => ReviewService.leave(productId, data),
    onSuccess() {
      const refetchFilters: RefetchQueryFilters = {
        queryKey: ['get product', productId] as QueryKey
      };
      queryClient.refetchQueries(refetchFilters);
      reset();
    }
  });

  const onSubmit: SubmitHandler<IReviewFields> = (data) => {
    mutate(data);
  };

  if (isSuccess) return <div>✅ Отзыв успешно опубликован!</div>;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Heading classname="text-center mb-4 h-3">Оставьте отзыв</Heading>

        {isPending ? (
          <Loader />
        ) : (
          <div>
            <Controller
              control={control}
              name="rating"
              rules={{ required: 'Rating is required' }}
              render={({ field: { onChange, value } }) => (
                <div className="flex justify-center mt-8"> {/* Увеличиваем отступ сверху */}
                  <Rating
                    onClick={onChange}
                    initialValue={value}
                    SVGstyle={{ display: 'inline-block' }}
                    size={25} 
                    transition
                  />
                </div>
              )}
            />

            <textarea
              {...formRegister('comment', { required: 'Text is required' })}
              placeholder="Поделитесь мнением об игре..."
              className="rounded-md border border-gray/70 bg-white p-3 block mt-4 resize-none w-full text-sm min-h-[110px]"
            />

            {Object.values(errors).length > 0 && (
              <ul className="text-red animate-opacity text-sm list-disc pl-4 mt-3">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error?.message}</li>
                ))}
              </ul>
            )}

            <div className="text-center mb-2 mt-8">
              <Button type="submit" variant="orange">
                Опубликовать
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default LeaveReviewForm;
