const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/30 border-t border-border py-6 mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2025 Created by SustainEco Systems & Services
with support of Chintan Environmental Research & Action Group, SBI Foundation and Ayodhya Nagar Nigam</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
