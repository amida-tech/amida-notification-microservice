import httpStatus from 'http-status';
import Promise from 'bluebird';
import db from '../../config/sequelize';
import APIError from '../helpers/APIError';
import Sequelize from 'sequelize';

const Device = db.Device;
const Notification = db.Notification;
const User = db.User;
const Op = Sequelize.Op;



function index(req, res, next) {
  const { username } = req.user;
  User.findAll({where: {username}}).then(currentUser => {
    var date1 = new Date();
    var date2 = new Date(currentUser.createdAt);
    var timeDiff = Math.abs(date1.getTime() - date2.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    console.log(diffDays)
    Article.findAll({
      where: { articleDayReceived: { [Op.lte]: diffDays }  },
      order: [['articleDayReceived', 'DESC'],['articleOrder', 'ASC'],['id', 'DESC']]
    }).then(articles => {
      res.send(articles)
    })
  })
}





export default {
    index
};
