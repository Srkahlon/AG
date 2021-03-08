const User = require('../models').User;
const Employee = require('../models').Employee;
const globals = require('../config/globals');
const Joi = require('joi');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;      

//UserController that does registartion, login and gets users list
module.exports.UserController = class UserController {

    register(req,res){
        var body = req.body;
        //Validation of the incoming request body
        const registerSchema = Joi.object().keys({ 
            first_name: Joi.string().required().label("First Name"),
            last_name: Joi.string().required().label("Last Name"),
            email_id: Joi.string().email().regex(/\S+@\S+\.\S+/).trim().required().label("Email"),
            password : Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,10}$/).required().label("Password"),
            employee_id : Joi.string().required().label("Employee Id"),
            organization_name : Joi.string().required().label("Organization Name")
        });
        const result = registerSchema.validate(body);
        if(result.hasOwnProperty("error"))
        {
            //Validation exception
            res.status(422).send(result);
        }
        else
        {
            //Check if employee with that employee id and organization name exists.
            Employee.findOne({where: {employee_id:body.employee_id,organization_name: body.organization_name}})
                    .then(employee => {
                        if(employee)
                        {
                            //Employee already exists, send response back.
                            res.status(200).send({
                                success: 1,
                                message : globals.employee_id_exists
                            });
                        }
                        else
                        {
                            //Encrypt the password
                            var hashedPassword = bcrypt.hashSync(body.password, 8);
                            body.password = hashedPassword
                            //Find or create user based on email id check.
                            User.findOrCreate({where: {email_id: body.email_id},defaults: body})
                                .then(([user, created]) => {
                                    //User with that email id already exists, send response back
                                    if(created == false)
                                    {
                                        res.status(200).send({
                                            success: 1,
                                            message : globals.email_exists
                                        });
                                    }
                                    else
                                    {
                                        user = JSON.stringify(user);
                                        user = JSON.parse(user);
                                        //Add employee details in the foreign table.
                                        Employee.create({user_id:user.id,employee_id:body.employee_id,organization_name:body.organization_name})
                                                .then(()=>{
                                                    //send a jwt token back, for further authentication once logged in
                                                    var token = jwt.sign({ id: user.id,email_id:user.email_id }, globals.secret, {
                                                        expiresIn: 86400
                                                    });
                                                    res.status(200).send({
                                                        success: 1,
                                                        message : "User created",
                                                        data: {
                                                            auth : true,
                                                            token: token
                                                        }
                                                    });
                                                })
                                                .catch(err => {
                                                    res.status(500).send({
                                                        success: 0,
                                                        message : globals.general_exception
                                                    });
                                                });
                                    }
                                })
                                .catch(err => {
                                    res.status(500).send({
                                        success: 0,
                                        message : globals.general_exception
                                    });
                                });
                        }
                       
                    })
                    .catch(err => {
                        res.status(500).send({
                            success: 0,
                            message : globals.general_exception
                        });
                    });
        }
    }

    login(req,res){
        var body = req.body;
        //Validation of the incoming request
        const loginSchema = Joi.object().keys({ 
            email_id: Joi.string().email().regex(/\S+@\S+\.\S+/).trim().required().label("Email"),
            password : Joi.string().required().label("Password")
        });
        const result = loginSchema.validate(body);
        if(result.hasOwnProperty("error"))
        {
            //Validation exception
            res.status(422).send(result);
        }
        else
        {
            //Check if user with that email id exists
            User.findOne({where: {email_id: body.email_id}})
                .then((user) => {
                    if(user)
                    {
                        user = JSON.stringify(user);
                        user = JSON.parse(user);
                        //Check if password matches.
                        var passwordIsValid = bcrypt.compareSync(body.password, user.password);
                        if(passwordIsValid)
                        {
                            var token = jwt.sign({ id: user.id,email_id:user.email_id }, globals.secret, {
                                expiresIn: 86400
                            });
                            res.status(200).send({
                                success: 1,
                                message : "Successful Login",
                                data: {
                                    auth : true,
                                    token: token,
                                    first_name: user.first_name,
                                    last_name: user.last_name
                                }
                            });
                        }
                        else
                        {
                            res.status(200).send({
                                success: 1,
                                message : globals.invalid_email_password
                            });
                        }
                    }
                    else
                    {
                        res.status(200).send({
                            success: 1,
                            message : globals.invalid_email_password
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        success: 0,
                        message : globals.general_exception
                    });
                });
        }
    }

    //Get the users list
    getUserList(req,res)
    {
        var body = req.body;
        //Validation of incoming request
        const userListSchema = Joi.object().keys({ 
            search_field: Joi.string().valid('first_name', 'last_name', 'employee_id').optional().label("Search Field"),
            search_value : Joi.string().optional().label("Search Value"),
            sort_field: Joi.string().valid('first_name', 'last_name', 'email_id','employee_id','organization_name').optional().label("Sort Value"),
            page: Joi.number().optional().label("Page"),
            size: Joi.number().optional().label("Size")
        });
        const result = userListSchema.validate(body);
        if(result.hasOwnProperty("error"))
        {
            //Validation exception
            res.status(422).send(result);
        }
        else
        {
            var condition = {};
            var order = [];
            if(body.hasOwnProperty("search_field") && body.search_field != null && body.hasOwnProperty("search_value") && body.search_value != null)
            {
                if(body.search_field == "employee_id")
                {
                    condition["$employee.employee_id$"]= {[Op.iLike]: '%'+body.search_value+'%'};
                }
                else
                {
                    condition[body.search_field]= {[Op.iLike]: '%'+body.search_value+'%'};
                }        
            }
            if(body.hasOwnProperty("sort_field") && body.sort_field != null)
            {   
                if(body.sort_field == "employee_id" || body.sort_field == "organization_name")
                {
                    order.push(['employee',body.sort_field,'ASC']);
                }
                else
                {
                    order.push([body.sort_field,'ASC']);
                }
            }
            //Default page and size limit if not present in request.
            var page = 0;
            var size = 10;
            if(body.hasOwnProperty("page"))
            {
                page = body.page;
            }
            if(body.hasOwnProperty("size"))
            {
                size = body.size;
            }
            
            User.findAll({  attributes: ['first_name','last_name','email_id'],
                            where:condition, 
                            order: order,
                            limit: size,
                            offset: page,
                            include: [{
                                model: Employee,
                                as: 'employee',
                                attributes: ['employee_id','organization_name']
                            }]
                        })
                .then(users=>{
                    res.status(200).send(users);
                })
                .catch(err => {
                    res.status(500).send({
                        success: 0,
                        message : globals.general_exception
                    });
                });
        }
    }
};