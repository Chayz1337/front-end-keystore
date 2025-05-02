import { useState } from "react";
import Image from "next/image";
import { cn } from "@/src/utils/cn";



interface IProductGallery{
    images: string[]
}

export function ProductGallery({ images}: IProductGallery ) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      {/* Основное изображение продукта */}
      <Image
  src={images[activeIndex]}
  alt="Product Image"
  width={500}
  height={500}
  className="rounded-lg overflow-hidden object-cover"
  priority
  draggable={false}
  style={{ aspectRatio: '1/0.63', objectFit: 'cover' }} // Добавлено!
/>
      {/* Секция с миниатюрами изображений */}
      <div
        className="mt-6"
        style={{ width: '500px', overflowX: 'auto', whiteSpace: 'nowrap' }}
      >
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "duration-300 hover:shadow-md mr-5 last:mr-0 border-b-2 border-solid transition-all rounded-lg overflow-hidden inline-block",
              {
                "shadow-md border-primary": index === activeIndex,
                "border-transparent": index !== activeIndex,
              }
            )}
          >
            <Image
                draggable={false}
                src={image}
                alt={`Product Thumbnail ${index + 1}`}
                width={100}
                height={100}
                className="object-cover" // Добавлено!
                priority
                style={{ aspectRatio: '1/0.63', objectFit: 'cover' }} // Добавлено!
/>
          </button>
        ))}
      </div>
    </div>
  );
}
