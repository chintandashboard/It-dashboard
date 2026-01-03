const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border py-4 sm:py-6 mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-muted-foreground">
          <p className="text-[10px] xs:text-xs sm:text-sm leading-relaxed">
            © 2025 Created by <span className="font-medium">SustainEco Systems & Services</span>
          </p>
          <p className="text-[10px] xs:text-xs sm:text-sm leading-relaxed mt-1">
            with support of <span className="font-medium">Chintan Environmental Research & Action Group</span>, <span className="font-medium">SBI Foundation</span> and <span className="font-medium">Ayodhya Nagar Nigam</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
