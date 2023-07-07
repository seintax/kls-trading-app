CREATE TABLE sys_account (
    acct_id          int auto_increment primary key,
    acct_email       varchar(99) unique,
    acct_password    text,
    acct_fullname    varchar(99),
    acct_confirmed   tinyint DEFAULT 0,
    acct_isblocked   tinyint DEFAULT 0,
    acct_store       varchar(50)
);

CREATE TABLE sys_user (
    user_id          int auto_increment primary key,
    user_account     int,
    user_lname       varchar(45),
    user_fname       varchar(45),
    user_mname       varchar(45),
    user_gender      varchar(3),
    user_contact     varchar(40),
    user_address     text,
    user_display     text
);

CREATE TABLE sys_permission (
    perm_id          int auto_increment primary key,
    perm_account     int,
    perm_data        varchar(99)
);

CREATE TABLE sys_roles (
    role_id          int auto_increment primary key,
    role_name        varchar(99)
);

CREATE TABLE lib_category (
    ctgy_id          int auto_increment primary key,
    ctgy_name        varchar(75),
    ctgy_status      varchar(1) DEFAULT "A"
);

CREATE TABLE pos_archive_customer (
    cust_id          int auto_increment primary key,
    cust_name        varchar(99),
    cust_address     varchar(150),
    cust_contact     varchar(30),
    cust_email       varchar(99),
    cust_start       date,
    cust_recent      datetime,
    cust_count       int DEFAULT 0,
    cust_value       decimal(30,2) DEFAULT 0,
    cust_waive       decimal(30,2) DEFAULT 0,
    cust_status      varchar(1) DEFAULT "A"
);

CREATE TABLE pos_archive_store (
    stre_id          int auto_increment primary key,
    stre_code        varchar(50) unique,
    stre_name        varchar(75),
    stre_address     text,
    stre_contact     varchar(40),
    stre_status      varchar(1) DEFAULT "A"
);

CREATE TABLE pos_archive_supplier (
    supp_id          int auto_increment primary key,
    supp_name        varchar(99) unique,
    supp_address     varchar(150),
    supp_details     varchar(50),
    supp_telephone   varchar(30),
    supp_cellphone   varchar(40),
    supp_email       varchar(99),
    supp_rating      decimal(5,2),
    supp_status      varchar(1) DEFAULT "A"
);

CREATE TABLE pos_stock_masterlist (
    prod_id          int auto_increment primary key,
    prod_name        varchar(75),
    prod_category    varchar(75),
    prod_status      varchar(1) DEFAULT "A"
);

CREATE TABLE pos_stock_variant (
    vrnt_id          int auto_increment primary key,
    vrnt_product     int,
    vrnt_name        varchar(150),
);

CREATE TABLE pos_purchase_order (
    pord_id          int auto_increment primary key,
    pord_time        timestamp DEFAULT now(),
    pord_date        date,
    pord_supplier    int,
    pord_store       varchar(50),
    pord_category    varchar(75),
    pord_item_count  int,
    pord_ordr_total  decimal(10,2),
    pord_rqst_total  decimal(10,2),
    pord_rcvd_total  decimal(10,2),
    pord_progress    varchar(30),
    pord_status      varchar(30) DEFAULT 'PENDING',
    pord_expected    date,
    pord_by          int
);

CREATE TABLE pos_purchase_receivable (
    rcvb_id          int auto_increment primary key,
    rcvb_purchase    int,
    rcvb_product     int,
    rcvb_variant     int,
    rcvb_costing     decimal(30,2),
    rcvb_ordered     decimal(10,2),
    rcvb_balance     decimal(10,2),
    rcvb_received    decimal(10,2) DEFAULT 0
);

CREATE TABLE pos_purchase_billing (
    bill_id          int auto_increment primary key,
    bill_time        timestamp DEFAULT now(),
    bill_purchase    int,
    bill_supplier    int,
    bill_date        date,
    bill_amount      decimal(30,2),
    bill_reference   varchar(30),
    bill_by          int,
    bill_store       varchar(50)
);

CREATE TABLE pos_delivery_request (
    dlvr_id          int auto_increment primary key,
    dlvr_time        timestamp DEFAULT now(),
    dlvr_supplier    int,
    dlvr_refcode     varchar(50),
    dlvr_date        date,
    dlvr_remarks     varchar(150),
    dlvr_count       int DEFAULT 0,
    dlvr_value       decimal(30,2) DEFAULT 0,
    dlvr_by          int,
    dlvr_store       varchar(50)
);

CREATE TABLE pos_delivery_receipt (
    rcpt_id          int auto_increment primary key,
    rcpt_time        timestamp DEFAULT now(),
    rcpt_delivery    int,
    rcpt_receivable  int,
    rcpt_purchase    int,
    rcpt_product     int,
    rcpt_variant     int,
    rcpt_quantity    decimal(10,2),
);

CREATE TABLE pos_stock_inventory (
    invt_id          int auto_increment primary key,
    invt_time        timestamp DEFAULT now(),
    invt_product     int,
    invt_variant     int,
    invt_category    varchar(75),
    invt_delivery    int DEFAULT 0,
    invt_purchase    int DEFAULT 0,
    invt_orderno     varchar(50),
    invt_supplier    int DEFAULT 0,
    invt_store       varchar(50),
    invt_sku         varchar(99),
    invt_received    decimal(10,2),
    invt_stocks      decimal(10,2),
    invt_cost        decimal(30,2),
    invt_base        decimal(30,2),
    invt_price       decimal(30,2),
    invt_barcode     varchar(99),
    invt_alert       decimal(10,2),
    invt_acquisition varchar(10) DEFAULT 'PROCUREMENT',
    invt_sold_total  decimal(10,2),
    invt_trni_total  decimal(10,2)
);

CREATE TABLE pos_stock_price_adjust (
    prce_id          int auto_increment primary key,
    prce_time        timestamp DEFAULT now(),
    prce_item        int,
    prce_product     int,
    prce_variant     int,
    prce_stocks      decimal(10,2),
    prce_old_price   decimal(30,2),
    prce_new_price   decimal(30,2),
    prce_by          int,
    prce_store       varchar(50)
);

CREATE TABLE pos_transfer_request (
    trnr_id          int auto_increment primary key,
    trnr_time        timestamp DEFAULT now(),
    trnr_source      varchar(50),
    trnr_store       varchar(50),
    trnr_category    varchar(75),
    trnr_date        date,
    trnr_arrival     date,
    trnr_status      varchar(30) DEFAULT 'ON-GOING',
    trnr_count       int DEFAULT 0,
    trnr_value       decimal(30,2) DEFAULT 0
);

CREATE TABLE pos_transfer_receipt (
    trni_id          int auto_increment primary key,
    trni_time        timestamp DEFAULT now(),
    trni_transfer    int,
    trni_item        int,
    trni_product     int,
    trni_variant     int,
    trni_quantity    decimal(10,2),
    trni_received    decimal(10,2)
);

CREATE TABLE pos_acctg_accounts (
    
);

CREATE TABLE pos_sales_transaction (
    trns_id          int auto_increment primary key,
    trns_code        varchar(99) unique,
    trns_order       varchar(11),
    trns_time        timestamp DEFAULT now(),
    trns_vat         decimal(30,2),
    trns_total       decimal(30,2),
    trns_less        decimal(30,2),
    trns_net         decimal(30,2),
    trns_return      decimal(30,2) DEFAULT 0,
    trns_discount    decimal(5,2) DEFAULT 0,
    trns_tended      decimal(30,2),
    trns_change      decimal(30,2),
    trns_method      varchar(30),
    trns_shift       int,
    trns_status      varchar(20) DEFAULT 'READY',
    trns_account     int,
    trns_date        date,
    UNIQUE KEY `uniq_order` (trns_order, trns_date)
);

CREATE TABLE pos_sales_dispensing (
    sale_id          int auto_increment primary key,
    sale_trans       varchar(99),
    sale_index       varchar(20),
    sale_time        timestamp DEFAULT now(),
    sale_item        int,
    sale_product     int,
    sale_conv        int DEFAULT 0,
    sale_purchase    decimal(10,2),
    sale_dispense    decimal(10,2),
    sale_price       decimal(30,2),
    sale_vat         decimal(30,2),
    sale_total       decimal(30,2),
    sale_less        decimal(30,2) DEFAULT 0,
    sale_net         decimal(30,2),
    sale_discount    decimal(5,2) DEFAULT 0,
    sale_taxrated    decimal(5,2) DEFAULT 0,
    sale_toreturn    decimal(10,2) DEFAULT 0,
    sale_returned    decimal(10,2) DEFAULT 0
);

CREATE TABLE pos_sales_credit (
    cred_id          int auto_increment primary key,
    cred_creditor    int,
    cred_trans       varchar(99),
    cred_time        timestamp DEFAULT now(),
    cred_total       decimal(30,2),
    cred_partial     decimal(30,2),
    cred_balance     decimal(30,2),
    cred_payment     decimal(30,2),
    cred_tended      decimal(30,2),
    cred_change      decimal(30,2),
    cred_waived      decimal(30,2),
    cred_status      varchar(30) DEFAULT "ON-GOING",
    cred_settledon   timestamp
);

CREATE TABLE pos_return_transaction (
    rtrn_id          int auto_increment primary key,
    rtrn_trans       varchar(99),
    rtrn_time        timestamp DEFAULT now(),
    rtrn_p_vat       decimal(30,2),
    rtrn_p_total     decimal(30,2),
    rtrn_p_less      decimal(30,2),
    rtrn_p_net       decimal(30,2),
    rtrn_r_vat       decimal(30,2),
    rtrn_r_total     decimal(30,2),
    rtrn_r_less      decimal(30,2),
    rtrn_r_net       decimal(30,2),
    rtrn_discount    decimal(5,2) DEFAULT 0,
    rtrn_shift       int,
    rtrn_requestedby int,
    rtrn_requestedon timestamp DEFAULT now(),
    rtrn_authorizeby int,
    rtrn_authorizeon timestamp,
    rtrn_status      varchar(20) DEFAULT 'REQUESTING'
);

CREATE TABLE pos_return_dispensing (
    rsal_id          int auto_increment primary key,
    rsal_trans       varchar(99),
    rsal_time        timestamp DEFAULT now(),
    rsal_item        int,
    rsal_product     int,
    rsal_conv        int,
    rsal_request     int,
    rsal_qty         decimal(10,2),
    rsal_price       decimal(30,2),
    rsal_vat         decimal(30,2),
    rsal_total       decimal(30,2),
    rsal_less        decimal(30,2),
    rsal_net         decimal(30,2),
    rsal_discount    decimal(5,2) DEFAULT 0,
    rsal_taxrated    decimal(5,2) DEFAULT 0
);

CREATE TABLE pos_return_reimbursement (
    reim_id          int auto_increment primary key,
    reim_trans       varchar(99),
    reim_time        timestamp DEFAULT now(),
    reim_request     int,
    reim_method      varchar(30),
    reim_amount      decimal(30,2),
    reim_refcode     varchar(50),
    reim_account     int,
    reim_shift       int
);

CREATE TABLE pos_shift_schedule (
    shft_id          int auto_increment primary key,
    shft_account     int,
    shft_start       timestamp DEFAULT now(),
    shft_beg_cash    decimal(30,2) DEFAULT 0,
    shft_status      varchar(20) DEFAULT 'START',
    shft_close       timestamp,
    shft_end_cash    decimal(30,2) DEFAULT 0,
    shft_total_hrs   varchar(10)
);

CREATE TABLE pos_shift_remittance (
    rmtt_id          int auto_increment primary key,
    rmtt_account     int,
    rmtt_shift       int,
    rmtt_time        timestamp DEFAULT now(),
    rmtt_amount      decimal(30,2),
    rmtt_collection  decimal(30,2),
    rmtt_reviewedby  int,
    rmtt_approvedby  int
);

CREATE TABLE pos_shift_rcd (
    crcd_id          int auto_increment primary key,
    crcd_account     int,
    crcd_shift       int,
    crcd_time        timestamp DEFAULT now(),
    crcd_bills       int DEFAULT 0,
    crcd_php_2k      int DEFAULT 0,
    crcd_php_1k      int DEFAULT 0,
    crcd_php_5h      int DEFAULT 0,
    crcd_php_2h      int DEFAULT 0,
    crcd_php_1h      int DEFAULT 0,
    crcd_php_50      int DEFAULT 0,
    crcd_php_20      int DEFAULT 0,
    crcd_php_10      int DEFAULT 0,
    crcd_php_5p      int DEFAULT 0,
    crcd_php_1p      int DEFAULT 0,
    crcd_php_0c      int DEFAULT 0,
    crcd_total       decimal(30,2)
);