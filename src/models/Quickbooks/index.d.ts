/**
 * This file is a backup 
 * 
 * In case of node_modules folder deletion
 * create an index.d.ts filt in "@root/node_modules/node-quickbooks"
 * include line "types": "index.d.ts", in node_moduels/node-quickbooks/package.json
 *
 */ 
declare module "node-quickbooks" {

	class QuickbooksClient {
		constructor(params: QuickbooksClient.QuickbooksClientConfig);
		//Account
		createAccount(params: Account): Account
		getAccount(Id: string): Account
		updateAccount(params: Account): Account
		//Customer
		createCustomer(params: Customer): Customer
		getCustomer(Id: string): Customer
		updateCustomer(params: Customer.SparseUpdateCustomer | Customer.FullUpdateCustomer): Customer
		//Item
		createItem(params: Item): Item
		getItem(Id: string): Item
		updateItem(params: Item): Item
		//SalesReceipt
		createSalesReceipt(params: SalesReceipt.CreateSalesReceipt): SalesReceipt
		getSalesReceipt(Id: string): SalesReceipt
		deleteSalesReceipt(params: SalesReceipt.DeleteSalesReceipt): SalesReceipt.DeletedReceipt
		voidSalesReceipt(params: SalesReceipt.VoidSalesReceipt): SalesReceipt
	}

	namespace QuickbooksClient {
		export interface QuickbooksClientConfig {
			consumerKey: string
			consumerSecret: string
			token: string
			tokenSecret: string
			realmId: string
			useSandbox: boolean
			debug: boolean
			endpoint: string
			testEmail?: string  // Use this email address for testing send*Pdf functions
			minorVersion?: string // Use to set minorversion for request
			oAuthVersion: string
			refreshToken?: string
		}
	}

	class Account {
		Id: string
		SyncToken: string
		Name: string
		AcctNum?: string //app internal reference
		CurrencyRef: Currency.ReferenceType
		ParentRef?: Account.ReferenceType
		Description?: string
		Active: boolean
		MetaData: MetaDataType
		SubAccount?: boolean
		readonly Classification?: string
		readonly FullyQualifiedName?: string
		AccountType: string
		AccountSubType?: string
		readonly CurrentBalanceWithSubAccounts?: number
		readonly CurrentBalance?: number
	}

	namespace Account {
		export interface ReferenceType {
			value: string
			name?: string
		}

		//Classification --> AccountType --> AccountSubType
		export enum Classification {
			asset = "Asset",
			equity = "Equity",
			expense = "Expense",
			liability = "Liability",
			revenue = "Revenue"
		}

		export enum AssetAccountType {
			bank = "bank",
			other = "Other Asset",
			otherCurrent = "Other Current Asset",
			fixed = "Fixed Asset",
			receivable = "Accounts Receivable"
		}

		export enum EquityAcountType {
			equity = "Equity",
		}

		export enum ExpenseAccountType {
			expense = "Expense",
			other = "Other Expense",
			costOfGoods = "Cost of Goods Sold"
		}

		export enum LiabilityAccountType {
			payable = "Accounts Payable",
			creditCard = "Credit Cart",
			longTerm = "Long Term Liability",
			otherCurrent = "Other Current Liability",
		}

		export enum RevenueAccountType {
			income = "Income",
			other = "Other Income"
		}

		export enum BankSubType {
			default = "CashOnHand",
			checking = "Checking",
			moneyMarket = "MoneyMarket",
			rentsHeldInTrust = "RentsHeldInTrust",
			savings = "Savings",
			trustAccounts = "TrustAccounts",
		}

		export enum OtherCurrentSubType {
			default = "EmployeeCashAdvances",
			allowanceForBadDebts = "AllowanceForBadDebts",
			developmentCosts = "DevelopmentCosts",
			otherCurrentAssets = "OtherCurrentAssets",
			inventory = "Inventory",
			investment_MortgageRealEstateLoans = "Investment_MortgageRealEstateLoans",
			investment_Other = "Investment_Other",
			investment_TaxExemptSecurities = "Investment_TaxExemptSecurities",
			investment_USGovernmentObligations = "Investment_USGovernmentObligations",
			loansToOfficers = "LoansToOfficers",
			loansToOthers = "LoansToOthers",
			loansToStockholders = "LoansToStockholders",
			prepaidExpenses = "PrepaidExpenses",
			retainage = "Retainage",
			undepositedFunds = "UndepositedFunds"
		}

		export enum FixedAssetSubtype {
			default = "FurnitureAndFixtures",
			accumulatedDepletion = "AccumulatedDepletion",
			accumulatedDepreciation = "AccumulatedDepreciation",
			depletableAssets = "DepletableAssets",
			fixedAssetComputers = "FixedAssetComputers",
			fixedAssetCopiers = "FixedAssetCopiers",
			fixedAssetFurniture = "FixedAssetFurniture",
			fixedAssetPhone = "FixedAssetPhone",
			fixedAssetPhotoVideo = "FixedAssetPhotoVideo",
			fixedAssetSoftware = "FixedAssetSoftware",
			fixedAssetOtherToolsEquipment = "FixedAssetOtherToolsEquipment",
			land = "Land",
			leaseholdImprovements = "LeaseholdImprovements",
			otherFixedAssets = "OtherFixedAssets",
			accumulatedAmortization = "AccumulatedAmortization",
			buildings = "Buildings",
			intangibleAssets = "IntangibleAssets",
			machineryAndEquipment = "MachineryAndEquipment",
			vehicles = "Vehicles",
		}

		export enum OtherAssetSubType {
			default = "Licenses",
			LeaseBuyout = "LeaseBuyout",
			OtherLongTermAssets = "OtherLongTermAssets",
			SecurityDeposits = "SecurityDeposits",
			AccumulatedAmortizationOfOtherAssets = "AccumulatedAmortizationOfOtherAssets",
			Goodwill = "Goodwill",
			OrganizationalCosts = "OrganizationalCosts",
		}

		export enum AccountsReceivableSubType {
			receivable = "Accounts Receivable "
		}

		export enum EquitySubType {
			default = "OpeningBalanceEquity",
			partnersEquity = "PartnersEquity",
			retainedEarnings = "RetainedEarnings",
			accumulatedAdjustment = "AccumulatedAdjustment",
			ownersEquity = "OwnersEquity",
			paidInCapitalOrSurplus = "PaidInCapitalOrSurplus",
			partnerContributions = "PartnerContributions",
			partnerDistributions = "PartnerDistributions",
			preferredStock = "PreferredStock",
			commonStock = "CommonStock",
			treasuryStock = "TreasuryStock",
			estimatedTaxes = "EstimatedTaxes",
			healthcare = "Healthcare",
			personalIncome = "PersonalIncome",
			personalExpense = "PersonalExpense",
		}

		export enum ExpenseSubType {
			default = "Travel",
			advertisingPromotional = "AdvertisingPromotional",
			badDebts = "BadDebts",
			bankCharges = "BankCharges",
			charitableContributions = "CharitableContributions",
			commissionsAndFees = "CommissionsAndFees",
			entertainment = "Entertainment",
			entertainmentMeals = "EntertainmentMeals",
			equipmentRental = "EquipmentRental",
			financeCosts = "FinanceCosts",
			globalTaxExpense = "GlobalTaxExpense",
			insurance = "Insurance",
			interestPaid = "InterestPaid",
			legalProfessionalFees = "LegalProfessionalFees",
			officeExpenses = "OfficeExpenses",
			officeGeneralAdministrativeExpenses = "OfficeGeneralAdministrativeExpenses",
			otherBusinessExpenses = "OtherBusinessExpenses",
			otherMiscellaneousServiceCost = "OtherMiscellaneousServiceCost",
			promotionalMeals = "PromotionalMeals",
			rentOrLeaseOfBuildings = "RentOrLeaseOfBuildings",
			repairMaintenance = "RepairMaintenance",
			shippingFreightDelivery = "ShippingFreightDelivery",
			suppliesMaterials = "SuppliesMaterials",
			travelMeals = "TravelMeals",
			utilities = "Utilities",
			auto = "Auto",
			costOfLabor = "CostOfLabor",
			duesSubscriptions = "DuesSubscriptions",
			payrollExpenses = "PayrollExpenses",
			taxesPaid = "TaxesPaid",
			unappliedCashBillPaymentExpense = "UnappliedCashBillPaymentExpense",
			utilities = "Utilities",
		}

		export enum OtherExpenseSubType {
			default = "Depreciation",
			exchangeGainOrLoss = "ExchangeGainOrLoss",
			otherMiscellaneousExpense = "OtherMiscellaneousExpense",
			penaltiesSettlements = "PenaltiesSettlements",
			amortization = "Amortization",
			gasAndFuel = "GasAndFuel",
			homeOffice = "HomeOffice",
			homeOwnerRentalInsurance = "HomeOwnerRentalInsurance",
			otherHomeOfficeExpenses = "OtherHomeOfficeExpenses",
			mortgageInterest = "MortgageInterest",
			rentAndLease = "RentAndLease",
			repairsAndMaintenance = "RepairsAndMaintenance",
			parkingAndTolls = "ParkingAndTolls",
			vehicle = "Vehicle",
			vehicleInsurance = "VehicleInsurance",
			vehicleLease = "VehicleLease",
			vehicleLoanInterest = "VehicleLoanInterest",
			vehicleLoan = "VehicleLoan",
			vehicleRegistration = "VehicleRegistration",
			vehicleRepairs = "VehicleRepairs",
			otherVehicleExpenses = "OtherVehicleExpenses",
			utilities = "Utilities",
			washAndRoadServices = "WashAndRoadServices",
		}

		export enum CostOfGoodsSubType {
			equipmentRentalCos = "EquipmentRentalCos",
			otherCostsOfServiceCos = "OtherCostsOfServiceCos",
			shippingFreightDeliveryCos = "ShippingFreightDeliveryCos",
			suppliesMaterialsCogs = "SuppliesMaterialsCogs",
			costOfLaborCos = "CostOfLaborCos",
		}

		export enum AccountsPayableSubType {
			payable = "Accounts Payable"
		}

		export enum CredidCartSubType {
			default = "Credit Card",
		}

		export enum LongTermLiabilitySubType {
			default = "NotesPayable",
			otherLongTermLiabilities = "OtherLongTermLiabilities",
			shareholderNotesPayable = "ShareholderNotesPayable",
		}

		export enum OtherCurrentLiabilitySubType {
			directDepositPayable = "DirectDepositPayable",
			lineOfCredit = "LineOfCredit",
			loanPayable = "LoanPayable",
			globalTaxPayable = "GlobalTaxPayable",
			globalTaxSuspense = "GlobalTaxSuspense",
			default = "OtherCurrentLiabilities",
			payrollClearing = "PayrollClearing",
			payrollTaxPayable = "PayrollTaxPayable",
			prepaidExpensesPayable = "PrepaidExpensesPayable",
			rentsInTrustLiability = "RentsInTrustLiability",
			trustAccountsLiabilities = "TrustAccountsLiabilities",
			federalIncomeTaxPayable = "FederalIncomeTaxPayable",
			insurancePayable = "InsurancePayable",
			salesTaxPayable = "SalesTaxPayable",
			stateLocalIncomeTaxPayable = "StateLocalIncomeTaxPayable",
		}

		export enum IncomeAccountSubType {
			nonProfitIncome = "NonProfitIncome",
			default = "OtherPrimaryIncome",
			salesOfProductIncome = "SalesOfProductIncome",
			serviceFeeIncome = "ServiceFeeIncome",
			discountsRefundsGiven = "DiscountsRefundsGiven",
			unappliedCashPaymentIncome = "UnappliedCashPaymentIncome",
		}

		export enum OtherIncomeSubType {
			dividendIncome = "DividendIncome",
			interestEarned = "InterestEarned",
			default = "OtherInvestmentIncome",
			otherMiscellaneousIncome = "OtherMiscellaneousIncome",
			taxExemptInterest = "TaxExemptInterest",
		}
	}

	class Item {
		Id: string
		Name: string //unique
		SyncToken: string
		InvStartDate: Item.InvStartDteType
		Type: string
		QtyOnHand?: number
		AssetAccountRef: Account.ReferenceType
		Sku?: string //internal itemId
		SalesTaxIncluded?: boolean
		TrackQtyOnHand?: boolean
		PurchaseTaxIncluded?: boolean
		Description?: string
		SubItem?: boolean
		Taxable?: boolean
		ReorderPoint?: number
		MetaData: MetaDataType
		Active?: boolean
		PurchaseCost?: number
		ParentRef?: Item.ReferenceType
		UnitPrice?: number
		readonly FullyQualifiedName?: string
		IncomeAccountRef?: Account.ReferenceType //required for Inventory Type Items
	}

	namespace Item {
		export interface ReferenceType {
			value: string
			name?: string
		}
		export enum ItemType {
			inventory = "Inventory",
			group = "Group",
			service = "Service",
			noninventory = "NonInventory",
			category = "Category"
		}
		export interface InvStartDteType {
			date: Date
		}
	}

	class Customer {
		Id: string
		PrimaryEmailAddr?: Customer.CustomerEmail
		SyncToken: string
		domain: "QBO"
		Title?: string
		GivenName?: string
		MiddleName?: string
		Suffix?: string
		FamilyName?: string
		DisplayName?: string
		CurrencyRef?: Currency.ReferenceType
		PrimaryPhone?: Customer.CustomerPhone
		sparse?: boolean
		Active: boolean
		ShipAddr: Customer.ShippingAddress
		Taxable: boolean
		Balance?: number
		MetaData?: MetaDataType
		readonly FullyQualifiedName?: string
	}

	namespace Customer {
		export interface ReferenceType {
			value: string
			name?: string
		}

		export interface CustomerEmail {
			Address?: string
		}

		export interface CustomerPhone {
			FreeFormNumber: string
		}

		export interface ShippingAddress {
			Id: string
			Line1?: string
			Line2?: string
			City?: string
			PostalCode: string
			Country?: string
		}

		export interface DeleteCustomer {
			Id: string
			SyncToken: string
		}

		export interface FullUpdateCustomer {
			SyncToken: string,
			Id: string,
			sparse: false
			PrimaryEmailAddr: Customer.CustomerEmail
			Title: string
			GivenName: string
			MiddleName: string
			Suffix: string
			FamilyName: string
			DisplayName: string
			CurrencyRef: Currency.ReferenceType
			PrimaryPhone: Customer.CustomerPhone
			Active: boolean
			ShipAddr: Customer.ShippingAddress
			Taxable: boolean
			Balance: number
		}

		export interface SparseUpdateCustomer {
			SyncToken: string,
			Id: string,
			sparse: true
			PrimaryEmailAddr?: Customer.CustomerEmail
			Title?: string
			GivenName?: string
			MiddleName?: string
			Suffix?: string
			FamilyName?: string
			DisplayName?: string
			CurrencyRef?: Currency.ReferenceType
			PrimaryPhone?: Customer.CustomerPhone
			sparse?: boolean
			Active?: boolean
			ShipAddr?: Customer.ShippingAddress
			Taxable?: boolean
			Balance?: number
		}
	}

	namespace TaxCode {
		export interface ReferenceType {
			value: string
			name?: string
		}
	}

	namespace Currency {
		export interface ReferenceType {
			value: string //three letter code
			name?: string
		}
	}

	class SalesReceipt {
		Id: string
		SyncToken?: string
		Line: SalesItemLine
		CustomerRef: Customer.ReferenceType
		CurrencyRef?: Currency.ReferenceType
		BillEmail?: SalesReceipt.BillEmail
		TxnDate?: Date
		ShipDate?: Date
		TrackingNum?: string
		TxnSource?: string
		DocNumber?: string
		PrivateNote?: string
		DepositToAccountRef?: Account.ReferenceType
		EmailStatus?: string
		ShipAddr?: Customer.ShippingAddress
		readonly TotalAmt?: number
		readonly Balance?: number
	}

	namespace SalesReceipt {

		export interface SalesItemLine {
			Id: string
			DetailType: "SalesItemLineDetail"
			SalesItemLineDetail: {
				TaxCodeRef?: TaxCode.ReferenceType
				Qty?: number
				UnitPrice?: number
				ItemRef: Item.ReferenceType
			}
			Amount: number
			Description?: string
			LineNum?: number
		}

		export interface BillEmail {
			Address?: string
		}

		export enum emailStatus {
			notset = "",
			notSent = "NeedToSend",
			sent = "EmailSent"
		}

		export interface CreateSalesReceipt {
			Line: SalesReceipt.SalesItemLine
			CurrencyRef: Currency.ReferenceType
		}

		export interface DeleteSalesReceipt {
			Id: string
			SyncToken: string
		}

		export interface DeletedReceipt {
			Id: string
			status: string
			domain: "QBO"
		}

		export interface VoidSalesReceipt {
			SyncToken: string
			Id: string
			sparse: true
		}
	}

	export interface MetaDataType {
		CreateTime: Date
		LastUpdatedTime: Date
	}
}