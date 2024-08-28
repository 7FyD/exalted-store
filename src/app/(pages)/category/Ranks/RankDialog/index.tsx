import type { Product } from "../../../../../payload/payload-types";
import { AddToCartButton } from "../../../../_components/AddToCartButton";
import { RemoveFromCartButton } from "../../../../_components/RemoveFromCartButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../_components/ui/dialog";

interface RankDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

// const benefits = [
//   {
//     title: "benefit 1",
//     description: "benefit 1 description",
//   },
//   {
//     title: "benefit 2",
//     description: "benefit 2 description",
//   },
//   {
//     title: "benefit 3",
//     description: "benefit 3 description",
//   },
//   {
//     title: "benefit 4",
//     description: "benefit 4 description",
//   },
//   {
//     title: "benefit 5",
//     description: "benefit 5 description",
//   },
//   {
//     title: "benefit 6",
//     description: "benefit 6 description",
//   },
// ];

const RankDialog: React.FC<RankDialogProps> = ({ isOpen, onClose, product }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-md sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{product.title} rank benefits</DialogTitle>
          <DialogDescription>{product.information}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {product.benefits.map((benefit, index) => (
            <div className={index % 2 === 0 ? "bg-accent" : ""} key={index}>
              <h3 className="text-lg font-semibold">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
        <DialogFooter className="flex !flex-col gap-4 items-center justify-center">
          <AddToCartButton className="mx-auto" product={product} />
          <RemoveFromCartButton className="mx-auto" product={product} hideIfNotInCart />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RankDialog;
