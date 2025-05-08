export const categories = [
    { value: "print", label: "Print" },
    { value: "plain", label: "Plain" },
    { value: "denim", label: "Denim" },
    { value: "check", label: "Check" },
    { value: "lycra", label: "Lycra" },
    { value: "kurta", label: "Kurta" },
    { value: "lining", label: "Lining" },
    { value: "rfd", label: "RFD" },
    { value: "dobby", label: "Dobby" },
    { value: "surat", label: "Surat" },
    {value:"chirag",label:"Chirag"},
    {value:"studio",label:"Studio"},
    
];


// utils/dateRanges.js

export const getDateRange = (key) => {
    const now = new Date();
    let startDate, endDate;
  
    switch (key) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
  
      case "yesterday":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        endDate   = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
  
      case "thisWeek":
        const dayOfWeek = now.getDay(); // Sunday = 0
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
        endDate   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
  
      case "lastWeek":
        const lastWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 7);
        const lastWeekEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        startDate = lastWeekStart;
        endDate   = lastWeekEnd;
        break;
  
      case "thisMonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate   = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
  
      case "lastMonth":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate   = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
  
      case "allTime":
        startDate = new Date(2000, 0, 1); // arbitrarily early
        endDate   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
  
      default:
        // fallback: this week
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        endDate   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    }
  
    return { startDate, endDate };
  };

  export const DATE_FILTER_OPTIONS = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "thisWeek" },
    { label: "Last Week", value: "lastWeek" },
    { label: "This Month", value: "thisMonth" },
    { label: "Last Month", value: "lastMonth" },
    { label: "All Time", value: "allTime" },
  ];
  
  


 export const sizes = [
    { value: 's', label: "S" },
    { value: 'm', label: "M" },
    { value: 'l', label: "L" },
    { value: 'xl', label: "XL" },
    { value: 'xxl', label: "XXL" },
    { value: '2024', label: "20/24" },
    { value: '2630', label: "26/30" },
    { value: '3236', label: "32/36" },
    { value: '38', label: "38" }


];

export const expenses = [
    { value: 'washing', label: 'Washing' },
    { value: 'kadhai', label: 'Kadhai' },
    { value: 'pasting', label: 'Pasting' },
    { value: 'button', label: 'Button' },
    { value: 'design', label: 'Design' },
    { value: 'print', label: 'Print' },
    { value: 'id', label: 'ID' },
    { value: 'double-pocket', label: 'Double Pocket' },
    {value:'others',label:'Others'},
];

