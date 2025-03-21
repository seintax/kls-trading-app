CREATE TABLE sys_account (
    acct_id          int auto_increment primary key,
    acct_email       varchar(99) unique,
    acct_password    text,
    acct_fullname    varchar(99),
    acct_confirmed   tinyint DEFAULT 0,
    acct_isblocked   tinyint DEFAULT 0,
    acct_store       varchar(50),
    acct_role        varchar(99)
);

ALTER TABLE sys_account ADD COLUMN acct_role varchar(99);

INSERT INTO sys_account (acct_email,acct_password,acct_fullname,acct_store,acct_role) VALUES ('SEINTAX','$2a$10$EwcQz1bHeYqo8fbgDMSBl.MWIgExkqECMh52ABA2.qrnFOv8gbt/m','DEVELOPER','DevOp','DevOp');

UPDATE sys_user SET acct_role='DevOp' WHERE acct_store='DevOp';

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

CREATE TABLE sys_config (
    conf_id          int auto_increment primary key,
    conf_account     int unique,
    conf_json        text
);

DROP TABLE sys_permission;
CREATE TABLE sys_permission (
    perm_id          int auto_increment primary key,
    perm_name        varchar(50) unique,
    perm_json        text
);

DROP TABLE sys_roles;
CREATE TABLE sys_roles (
    role_id          int auto_increment primary key,
    role_name        varchar(99) unique,
    role_permission  text
);

INSERT INTO sys_roles (role_name,role_permission) VALUES ('DevOp', '{"cashering-menu":{"show":true,"create":true,"read":true,"update":true,"delete":true,"view-receipt":true,"view-draft":true},"purchase-order-menu":{"show":true,"create":true,"read":true,"update":true,"delete":true},"inventory-menu":{"show":true,"read":true,"update":true},"stock-transfer-menu":{"show":true,"create":true,"read":true,"update":true,"delete":true},"receiving-menu":{"show":true,"create":true,"read":true,"update":true,"delete":true},"credits-menu":{"show":true,"create":true,"read":true,"update":true,"delete":true},"cheque-monitor-menu":{"show":true,"create":true,"read":true,"update":true,"delete":true},"expenses-menu":{"show":true,"create":true,"read":true,"update":true,"delete":true},"branches-menu":{"show":true,"create":true,"read":true,"update":true,"delete":true},"suppliers-menu":{"show":true,"create":true,"read":true,"update":true,"delete":true},"customers-menu":{"show":true,"create":true,"read":true,"update":true,"delete":true},"categories-menu":{"show":true,"create":true,"read":true,"update":true,"delete":true},"masterlist-menu":{"show":true,"create":true,"read":true,"update":true,"delete":true},"options-menu":{"show":true,"create":true,"read":true,"update":true,"delete":true},"inclusions-menu":{"show":true,"create":true,"read":true,"update":true,"delete":true},"permissions-menu":{"show":true,"create":true,"read":true,"update":true,"delete":true},"reports-menu":{"show":true,"create":true,"read":true,"update":true,"delete":true},"accounts-menu":{"show":true,"create":true,"read":true,"update":true,"delete":true},"roles-menu":{"show":true,"create":true,"read":true,"update":true,"delete":true}}');

CREATE TABLE lib_category (
    ctgy_id          int auto_increment primary key,
    ctgy_name        varchar(75) unique,
    ctgy_status      varchar(1) DEFAULT "A"
);

CREATE TABLE lib_option (
    optn_id          int auto_increment primary key,
    optn_name        varchar(75) unique,
    optn_status      varchar(1) DEFAULT "A"
);

CREATE TABLE lib_variant (
    vrnt_id          int auto_increment primary key,
    vrnt_product     int,
    vrnt_category    varchar(75),
    vrnt_option1     varchar(50),
    vrnt_serial      varchar(99),
    vrnt_option2     varchar(50),
    vrnt_model       varchar(99),
    vrnt_option3     varchar(50),
    vrnt_brand       varchar(99),
    vrnt_alert       int DEFAULT 0
);

ALTER TABLE lib_variant ADD COLUMN vrnt_alert int DEFAULT 0;

CREATE TABLE lib_inclusion (
    incl_id          int auto_increment primary key,
    incl_name        varchar(75) unique,
    incl_status      varchar(1) DEFAULT "A"
);

DROP TABLE pos_archive_customer;
CREATE TABLE pos_archive_customer (
    cust_id          int auto_increment primary key,
    cust_name        varchar(99) unique,
    cust_address     varchar(150),
    cust_contact     varchar(30),
    cust_email       varchar(99),
    cust_start       date,
    cust_recent      datetime,
    cust_count       int DEFAULT 0 COMMENT 'running count',
    cust_value       decimal(30,2) DEFAULT 0 COMMENT 'running value',
    cust_paid        decimal(30,2) DEFAULT 0 COMMENT 'running value',
    cust_waive       decimal(30,2) DEFAULT 0,
    cust_sales       decimal(30,2) DEFAULT 0,
    cust_status      varchar(1) DEFAULT "A"
);

ALTER TABLE pos_archive_customer ADD COLUMN cust_paid decimal(30,2) DEFAULT 0 AFTER cust_value;

ALTER TABLE pos_archive_customer ADD COLUMN cust_sales decimal(30,2) DEFAULT 0 AFTER cust_waive;

INSERT INTO pos_archive_customer (cust_id,cust_name) VALUES (0,'Walkin Customer');

DROP TABLE pos_archive_store;
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
    supp_telephone   varchar(99),
    supp_cellphone   varchar(99),
    supp_email       varchar(99),
    supp_rating      decimal(5,2),
    supp_status      varchar(1) DEFAULT "A"
);

CREATE TABLE pos_stock_masterlist (
    prod_id          int auto_increment primary key,
    prod_name        varchar(75) unique,
    prod_category    varchar(75),
    prod_status      varchar(1) DEFAULT "A"
);

DROP TABLE pos_purchase_order;
CREATE TABLE pos_purchase_order (
    pord_id             int auto_increment primary key,
    pord_time           timestamp DEFAULT now(),
    pord_date           date,
    pord_supplier       int,
    pord_store          varchar(50),
    pord_category       varchar(75),
    pord_item_count     int DEFAULT 0,
    pord_order_total    decimal(10,2) DEFAULT 0,
    pord_request_total  decimal(10,2) DEFAULT 0,
    pord_received_total decimal(10,2) DEFAULT 0 COMMENT 'running total',
    pord_raw_total      decimal(50,8) DEFAULT 0 COMMENT 'order total',
    pord_progress       varchar(30),
    pord_status         varchar(30) DEFAULT 'PENDING',
    pord_expected       date,
    pord_by             int
);

ALTER TABLE pos_purchase_order ADD COLUMN pord_raw_total decimal(50,8) DEFAULT 0 COMMENT 'order total' AFTER pord_received_total;

DROP TABLE pos_purchase_receivable;
CREATE TABLE pos_purchase_receivable (
    rcvb_id          int auto_increment primary key,
    rcvb_purchase    int,
    rcvb_product     int,
    rcvb_variant     int,
    rcvb_costing     decimal(30,2),
    rcvb_rawcost     decimal(50,8),
    rcvb_ordered     decimal(10,2),
    rcvb_balance     decimal(10,2) DEFAULT 0,
    rcvb_received    decimal(10,2) DEFAULT 0
);

ALTER TABLE pos_purchase_receivable ADD COLUMN rcvb_rawcost decimal(50,8) AFTER rcvb_costing;

DROP TABLE pos_purchase_billing;
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

DROP TABLE pos_delivery_request;
CREATE TABLE pos_delivery_request (
    dlvr_id          int auto_increment primary key,
    dlvr_time        timestamp DEFAULT now(),
    dlvr_supplier    int,
    dlvr_refcode     varchar(50),
    dlvr_date        date,
    dlvr_remarks     varchar(150),
    dlvr_count       int DEFAULT 0 COMMENT 'running count',
    dlvr_value       decimal(30,2) DEFAULT 0 COMMENT 'running value',
    dlvr_by          int,
    dlvr_store       varchar(50)
);

DROP TABLE pos_delivery_receipt;
CREATE TABLE pos_delivery_receipt (
    rcpt_id          int auto_increment primary key,
    rcpt_time        timestamp DEFAULT now(),
    rcpt_delivery    int,
    rcpt_receivable  int,
    rcpt_purchase    int,
    rcpt_product     int,
    rcpt_variant     int,
    rcpt_quantity    decimal(10,2),
    rcpt_pricing     decimal(30,2)
);

DROP TABLE pos_stock_inventory;
CREATE TABLE pos_stock_inventory (
    invt_id          int auto_increment primary key,
    invt_time        timestamp DEFAULT now(),
    invt_product     int,
    invt_variant     int,
    invt_category    varchar(75),
    invt_delivery    int DEFAULT 0,
    invt_purchase    int DEFAULT 0,
    invt_receipt     int DEFAULT 0,
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
    invt_alert       decimal(10,2) DEFAULT 0,
    invt_acquisition varchar(20) DEFAULT 'PROCUREMENT',
    invt_source      varchar(50) DEFAULT 'SUPPLIER',
    invt_transfer    int DEFAULT 0,
    invt_transmit    int DEFAULT 0,
    invt_sold_total  decimal(10,2) DEFAULT 0 COMMENT 'running count',
    invt_trni_total  decimal(10,2) DEFAULT 0 COMMENT 'running count',
    invt_adjt_total  decimal(10,2) DEFAULT 0 COMMENT 'running count for adjustment deductions',
    invt_apnd_total  decimal(10,2) DEFAULT 0 COMMENT 'running count for adjustment additions'
);

ALTER TABLE pos_stock_inventory ADD COLUMN invt_apnd_total  decimal(10,2) DEFAULT 0 COMMENT 'running count for adjustment additions';

ALTER TABLE pos_stock_inventory
    ADD COLUMN invt_source varchar(50) DEFAULT 'SUPPLIER',
    ADD COLUMN invt_transfer int DEFAULT 0;

CREATE TABLE pos_stock_price (
    prce_id          int auto_increment primary key,
    prce_time        timestamp DEFAULT now(),
    prce_item        int,
    prce_product     int,
    prce_variant     int,
    prce_stocks      decimal(10,2),
    prce_old_price   decimal(30,2),
    prce_new_price   decimal(30,2),
    prce_details     varchar(30) DEFAULT 'PRICE ADJUSTMENT',
    prce_account     int,
    prce_store       varchar(50)
);

DROP TABLE pos_stock_adjustment;
CREATE TABLE pos_stock_adjustment (
    adjt_id          int auto_increment primary key,
    adjt_time        timestamp DEFAULT now(),
    adjt_item        int,
    adjt_product     int,
    adjt_variant     int,
    adjt_quantity    decimal(10,2),
    adjt_pricing     decimal(30,2),
    adjt_operator    varchar(10) COMMENT 'value is either add or minus',
    adjt_details     varchar(99),
    adjt_remarks     varchar(99),
    adjt_by          decimal(30,2),
    adjt_store       varchar(50)
);

DROP TABLE pos_transfer_request;
CREATE TABLE pos_transfer_request (
    trnr_id          int auto_increment primary key,
    trnr_time        timestamp DEFAULT now(),
    trnr_source      varchar(50),
    trnr_store       varchar(50),
    trnr_category    varchar(75),
    trnr_date        date,
    trnr_status      varchar(30) DEFAULT 'ON-GOING',
    trnr_count       int DEFAULT 0 COMMENT 'running count',
    trnr_cost        decimal(50,8) DEFAULT 0 COMMENT 'running cost',
    trnr_value       decimal(30,2) DEFAULT 0 COMMENT 'running value',
    trnr_srp         decimal(30,2) DEFAULT 0 COMMENT 'running srp'
    trnr_arrive      int DEFAULT 0
);

ALTER TABLE pos_transfer_request ADD COLUMN trnr_arrive int DEFAULT 0;
ALTER TABLE pos_transfer_request ADD COLUMN trnr_srp decimal(30,2) DEFAULT 0 COMMENT 'running srp' AFTER trnr_value;
ALTER TABLE pos_transfer_request ADD COLUMN trnr_cost decimal(30,2) DEFAULT 0 COMMENT 'running cost' AFTER trnr_count;

DROP TABLE pos_transfer_receipt;
CREATE TABLE pos_transfer_receipt (
    trni_id          int auto_increment primary key,
    trni_time        timestamp DEFAULT now(),
    trni_transfer    int,
    trni_item        int,
    trni_product     int,
    trni_variant     int,
    trni_quantity    decimal(10,2),
    trni_cost        decimal(50,8),
    trni_baseprice   decimal(30,2),
    trni_pricing     decimal(30,2),
    trni_received    decimal(10,2),
    trni_arrival     date
);

ALTER TABLE pos_transfer_receipt ADD COLUMN trni_baseprice decimal(30,2) AFTER trni_quantity;
ALTER TABLE pos_transfer_receipt ADD COLUMN trni_pricing decimal(30,2) AFTER trni_quantity;
ALTER TABLE pos_transfer_receipt ADD COLUMN trni_cost decimal(30,2) AFTER trni_quantity;
ALTER TABLE pos_transfer_receipt ADD COLUMN trni_arrival date;

CREATE TABLE pos_acctg_accounts (
    acct_id          int auto_increment primary key,
    acct_name        varchar(99),
    acct_value       varchar(20),
    acct_description varchar(150)
);

CREATE TABLE pos_acctg_entries (
    entr_id          int auto_increment primary key,
    entr_time        timestamp DEFAULT now(),
    entr_account     int,
    entr_credit      decimal(30,2),
    entr_debit       decimal(30,2),
    entr_particulars varchar(150),
    entr_remarks     varchar(99)
);

DROP TABLE pos_archive_expenses;
CREATE TABLE pos_archive_expenses (
    expn_id          int auto_increment primary key,
    expn_time        timestamp DEFAULT now(),
    expn_inclusion   varchar(75),
    expn_particulars varchar(150),
    expn_purchase    decimal(30,2),
    expn_cash        decimal(30,2),
    expn_change      decimal(30,2),
    expn_remarks     varchar(99),
    expn_notes       varchar(150),
    expn_account     int,
    expn_store       varchar(50),
    expn_date        date
);

ALTER TABLE pos_archive_expenses ADD COLUMN expn_date  date;

ALTER TABLE pos_archive_expenses ADD COLUMN expn_store  varchar(50);

ALTER TABLE pos_archive_expenses ADD COLUMN expn_inclusion   varchar(75) AFTER expn_time;

DROP TABLE pos_sales_transaction;
CREATE TABLE pos_sales_transaction (
    trns_id          int auto_increment primary key,
    trns_code        varchar(99) unique,
    trns_time        timestamp DEFAULT now(),
    trns_vat         decimal(30,2),
    trns_total       decimal(30,2),
    trns_less        decimal(30,2) DEFAULT 0,
    trns_markdown    decimal(30,2) DEFAULT 0,
    trns_net         decimal(30,2),
    trns_return      decimal(30,2) DEFAULT 0,
    trns_discount    decimal(20,15) DEFAULT 0,
    trns_partial     decimal(30,2) DEFAULT 0,
    trns_tended      decimal(30,2) DEFAULT 0,
    trns_change      decimal(30,2) DEFAULT 0,
    trns_method      varchar(30),
    trns_status      varchar(20) DEFAULT 'COMPLETED',
    trns_account     int,
    trns_customer    int.
    trns_date        date
);

ALTER TABLE pos_sales_transaction ADD COLUMN trns_partial decimal(30,2) DEFAULT 0 AFTER trns_discount;

ALTER TABLE pos_sales_transaction ADD COLUMN trns_markdown decimal(30,2) DEFAULT 0 AFTER trns_less;

ALTER TABLE pos_sales_transaction ADD COLUMN trns_customer int AFTER trns_account;

DROP TABLE pos_sales_dispensing;
CREATE TABLE pos_sales_dispensing (
    sale_id          int auto_increment primary key,
    sale_trans       varchar(99),
    sale_index       varchar(20),
    sale_time        timestamp DEFAULT now(),
    sale_item        int,
    sale_product     int,
    sale_variant     int,
    sale_supplier    int,
    sale_purchase    decimal(10,2),
    sale_dispense    decimal(10,2),
    sale_price       decimal(30,2),
    sale_vat         decimal(30,2),
    sale_total       decimal(30,2),
    sale_less        decimal(30,2) DEFAULT 0,
    sale_markdown    decimal(30,2) DEFAULT 0,
    sale_net         decimal(30,2),
    sale_discount    decimal(20,15) DEFAULT 0,
    sale_taxrated    decimal(5,2) DEFAULT 0,
    sale_toreturn    decimal(10,2) DEFAULT 0,
    sale_returned    decimal(10,2) DEFAULT 0,
    sale_store       varchar(50)
);

ALTER TABLE pos_sales_dispensing ADD COLUMN sale_markdown decimal(30,2) DEFAULT 0 AFTER sale_less;
ALTER TABLE pos_sales_dispensing ADD COLUMN sale_store varchar(35);

UPDATE pos_sales_dispensing SET sale_store=(SELECT invt_store FROM pos_stock_inventory WHERE invt_id=sale_item);

DROP TABLE pos_sales_credit;
CREATE TABLE pos_sales_credit (
    cred_id          int auto_increment primary key,
    cred_creditor    int,
    cred_trans       varchar(99),
    cred_time        timestamp DEFAULT now(),
    cred_total       decimal(30,2),
    cred_partial     decimal(30,2) DEFAULT 0,
    cred_balance     decimal(30,2),
    cred_payment     decimal(30,2) DEFAULT 0,
    cred_returned    decimal(30,2) DEFAULT 0,
    cred_waived      decimal(30,2) DEFAULT 0,
    cred_outstand    decimal(30,2),
    cred_tended      decimal(30,2) DEFAULT 0,
    cred_change      decimal(30,2) DEFAULT 0,
    cred_reimburse   decimal(30,2) DEFAULT 0,
    cred_status      varchar(30) DEFAULT "ON-GOING",
    cred_settledon   timestamp,
    cred_account     int,
    cred_store       varchar(50)
);

ALTER TABLE pos_sales_credit ADD COLUMN cred_store varchar(50);

ALTER TABLE pos_sales_credit ADD COLUMN cred_account int;

ALTER TABLE pos_sales_credit ADD COLUMN cred_reimburse decimal(30,2) DEFAULT 0 AFTER cred_change;

DROP TABLE pos_payment_collection;
CREATE TABLE pos_payment_collection (
    paym_id          int auto_increment primary key,
    paym_trans       varchar(99),
    paym_customer    int,
    paym_time        timestamp DEFAULT now(),
    paym_type        varchar(20) DEFAULT 'SALES',
    paym_method      varchar(30),
    paym_total       decimal(30,2) COMMENT 'unaltered original amount',
    paym_amount      decimal(30,2),
    paym_refcode     varchar(50),
    paym_refdate     date,
    paym_refstat     varchar(30) DEFAULT 'NOT APPLICABLE',
    paym_returned    decimal(30,2) DEFAULT 0,
    paym_reimburse   int DEFAULT 0 COMMENT 'boolean value either 1 or 0',
    paym_account     int,
    paym_store       varchar(50)  
);

ALTER TABLE pos_payment_collection ADD COLUMN paym_store varchar(50);

ALTER TABLE pos_payment_collection ADD COLUMN paym_customer int AFTER paym_trans;

CREATE TABLE pos_payment_cheque (
    chqe_id          int auto_increment primary key,
    chqe_payment     int,
    chqe_amount      decimal(30,2),
    chqe_oldcode     varchar(50),
    chqe_olddate     date,
    chqe_refcode     varchar(50),
    chqe_refdate     date,
    chqe_details     varchar(30) DEFAULT 'CHEQUE REPLACEMENT',
    chqe_account     int
);

DROP TABLE pos_return_transaction;
CREATE TABLE pos_return_transaction (
    rtrn_id          int auto_increment primary key,
    rtrn_trans       varchar(99),
    rtrn_time        timestamp DEFAULT now(),
    rtrn_p_vat       decimal(30,2),
    rtrn_p_total     decimal(30,2),
    rtrn_p_less      decimal(30,2) DEFAULT 0,
    rtrn_p_markdown  decimal(30,2) DEFAULT 0, 
    rtrn_p_net       decimal(30,2),
    rtrn_r_vat       decimal(30,2),
    rtrn_r_total     decimal(30,2),
    rtrn_r_less      decimal(30,2) DEFAULT 0,
    rtrn_r_markdown  decimal(30,2) DEFAULT 0, 
    rtrn_r_net       decimal(30,2),
    rtrn_discount    decimal(20,15) DEFAULT 0,
    rtrn_account     int,
    rtrn_status      varchar(20) DEFAULT 'COMPLETED'
);

ALTER TABLE pos_return_transaction ADD COLUMN rtrn_p_markdown decimal(30,2) DEFAULT 0 AFTER rtrn_p_less;
ALTER TABLE pos_return_transaction ADD COLUMN rtrn_r_markdown decimal(30,2) DEFAULT 0 AFTER rtrn_r_less;

DROP TABLE pos_return_dispensing;
CREATE TABLE pos_return_dispensing (
    rsal_id          int auto_increment primary key,
    rsal_trans       varchar(99),
    rsal_time        timestamp DEFAULT now(),
    rsal_item        int,
    rsal_product     int,
    rsal_variant     int
    rsal_refund      int,
    rsal_quantity    decimal(10,2),
    rsal_price       decimal(30,2),
    rsal_vat         decimal(30,2),
    rsal_total       decimal(30,2),
    rsal_less        decimal(30,2) DEFAULT 0,
    rsal_markdown    decimal(30,2) DEFAULT 0, 
    rsal_net         decimal(30,2),
    rsal_discount    decimal(20,15) DEFAULT 0,
    rsal_taxrated    decimal(5,2) DEFAULT 0,
    rsal_store       varchar(50)
);

ALTER TABLE pos_return_dispensing ADD COLUMN rsal_markdown decimal(30,2) DEFAULT 0 AFTER rsal_less;

ALTER TABLE pos_return_dispensing ADD COLUMN rsal_variant int AFTER rsal_product;

ALTER TABLE pos_return_dispensing ADD COLUMN rsal_store varchar(50);

UPDATE pos_return_dispensing SET rsal_variant=(SELECT invt_variant FROM pos_stock_inventory WHERE invt_id=rsal_item);

UPDATE pos_return_dispensing SET rsal_store=(SELECT invt_store FROM pos_stock_inventory WHERE invt_id=rsal_item);

DROP TABLE pos_return_reimbursement;
CREATE TABLE pos_return_reimbursement (
    reim_id          int auto_increment primary key,
    reim_trans       varchar(99),
    reim_time        timestamp DEFAULT now(),
    reim_refund      int,
    reim_method      varchar(30),
    reim_amount      decimal(30,2),
    reim_refcode     varchar(50),
    reim_account     int
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

CREATE TABLE pos_income_statement (
    incm_id          int auto_increment primary key,
    incm_time        timestamp DEFAULT now(),
    incm_beg         date,
    incm_end         date,
    incm_month       varchar(30),
    incm_year        int,
    incm_noofdays    int,
    incm_store       varchar(50),
    incm_category    varchar(75),
    incm_data        text,
    incm_inventory   decimal(30,2),
    incm_by          int
)

CREATE TABLE pos_income_statement_print (
    prnt_id          int auto_increment primary key,
    prnt_time        timestamp DEFAULT now(),
    prnt_hash        text,
    prnt_data        text,
    prnt_by          int
)

CREATE TABLE sys_notification (
    ntfy_id         int auto_increment primary key,
    ntfy_date       date,
    ntfy_type       varchar(20),
    ntfy_message    text,
    ntfy_url        text
);

DELETE FROM pos_sales_transaction;
DELETE FROM pos_sales_dispensing;
DELETE FROM pos_sales_credit;
DELETE FROM pos_return_transaction;
DELETE FROM pos_return_reimbursement;
DELETE FROM pos_return_dispensing;
DELETE FROM pos_purchase_receivable;
DELETE FROM pos_purchase_order;
DELETE FROM pos_purchase_billing;
DELETE FROM pos_payment_collection;
DELETE FROM pos_payment_cheque;
DELETE FROM pos_delivery_receipt;
DELETE FROM pos_delivery_request;
DELETE FROM pos_stock_price;
DELETE FROM pos_transfer_receipt;
DELETE FROM pos_transfer_request;

-- Reverting Returns

UPDATE pos_sales_dispensing SET sale_dispense=1,sale_vat=1740,sale_total=14500,sale_markdown=1500,sale_net=13000,sale_returned=0 WHERE sale_trans='20240227-00003-000250';

UPDATE pos_sales_credit SET cred_balance=13000,cred_returned=0,cred_outstand=13000,cred_status='ON-GOING' WHERE cred_trans='20240227-00003-000250';

UPDATE pos_sales_transaction SET trns_vat=1740,trns_total=14500,trns_markdown=1500,trns_net=13000,trns_return=0 WHERE  trns_code='20240227-00003-000250';

DELETE FROM pos_return_transaction WHERE rtrn_trans='20240227-00003-000250';

DELETE FROM pos_return_dispensing WHERE rsal_trans='20240227-00003-000250';

-- Displaying the result of a subquery into a single field with concatenation

SELECT 
    trns_code,
    COALESCE(
        (
            SELECT 
                GROUP_CONCAT(a.category SEPARATOR ', ')
            FROM 
                (SELECT DISTINCT prod_category AS category, sale_trans AS trans 
                FROM pos_sales_dispensing, pos_stock_masterlist 
                WHERE sale_product=prod_id) a
            WHERE a.trans = trns_code
        ),
        'No Category'
    ) AS concatenated_category
FROM pos_sales_transaction LIMIT 10;