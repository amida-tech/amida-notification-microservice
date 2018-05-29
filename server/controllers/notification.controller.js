import httpStatus from 'http-status';
import Promise from 'bluebird';
import db from '../../config/sequelize';
import APIError from '../helpers/APIError';
import Sequelize from 'sequelize';

const User = db.User;
const UserTrack = db.UserTrack;
const Article = db.Article;
const Op = Sequelize.Op;



function index(req, res, next) {
  const { username } = req.user;
  User.findOne({where: {username}}).then(currentUser => {
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



  // }
  // Article.findAll({
  //   include: [{
  //     model: User,
  //     as: 'u',
  //     where:
  //
  //       Sequelize.where(
  //           // Sequelize.col('username') = username,
  //           Sequelize.fn('datediff', Sequelize.fn("NOW"), Sequelize.col('createdAt')), {
  //             [Op.gt]:  Sequelize.col('articleDayReceived')// OR [Op.gt] : 5
  //       }),

  //     required: true
  //    }]
  // }).then(response => {
  //   return res.send({ messages: response.rows, count: response.count })
  // });


export default {
    //list,
    index
};
