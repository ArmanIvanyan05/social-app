interface Props {
  feature: string;
}

export const FeatureUnavailable = ({ feature }: Props) => (
  <main className="container">
    <h1>{feature}</h1>
    <p role="status">
      This feature is not available with the current verified backend API.
    </p>
  </main>
);
