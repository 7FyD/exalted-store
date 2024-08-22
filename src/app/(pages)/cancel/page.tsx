import { Gutter } from "../../_components/Gutter";

const Cancel = () => {
  return (
    <Gutter>
      <p className="font-lg">
        Checkout cancelled. You have <strong>not</strong> been charged.
      </p>
    </Gutter>
  );
};

export default Cancel;
